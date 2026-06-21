
import { GraphData, NodeObject, LinkObject } from '../types';

/**
 * Parses a simple edge list file content (e.g., .gdcom, .txt) into graph data format.
 * Expected format: one edge per line, with two node IDs separated by whitespace.
 * e.g., "nodeA nodeB"
 */
export const parseEdgeList = (content: string): GraphData => {
  const links: LinkObject[] = [];
  const nodeSet = new Set<string>();
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const parts = trimmedLine.split(/\s+/);
    if (parts.length >= 2) {
      const [source, target] = parts;
      if (source && target) {
        links.push({ source, target });
        nodeSet.add(source);
        nodeSet.add(target);
      }
    }
  }

  const nodes: NodeObject[] = Array.from(nodeSet).map(id => ({ id, type: 'person' as const }));
  return { nodes, links };
};

/**
 * Parses a .ged (GEDCOM) file content into a graph.
 * If advancedMode is true, it creates nodes for Places, Dates, and Sources.
 */
export const parseGedcom = (content: string, advancedMode: boolean = false): GraphData => {
  const individuals = new Map<string, NodeObject>();
  // We use a general map for extra nodes to avoid duplicates (e.g. multiple people born in 'Jerusalem')
  const extraNodes = new Map<string, NodeObject>(); 
  const links: LinkObject[] = [];
  
  const families: { 
      id: string; 
      type: 'FAM'; 
      husb?: string; 
      wife?: string; 
      children: string[]; 
      facts: { nodeId: string; label: string }[];
  }[] = [];
  
  const lines = content.split('\n');
  
  let currentRecord: any = null;
  let currentEvent: string | null = null; // e.g., 'BIRT', 'DEAT', 'MARR'

  // Helper to add extra nodes and links
  const addFact = (value: string, type: 'place' | 'date' | 'source', label: string) => {
      if (!currentRecord || !currentRecord.id) return;
      
      const cleanValue = value.replace(/@/g, '').trim();
      const nodeId = `${type.toUpperCase()}:${cleanValue}`;
      
      // Add node if not exists
      if (!extraNodes.has(nodeId)) {
          extraNodes.set(nodeId, { id: nodeId, name: cleanValue, type });
      }

      const linkLabel = currentEvent ? `${currentEvent} ${label}` : label;

      if (currentRecord.type === 'FAM') {
          // If the fact belongs to a family (e.g., marriage date), we queue it to link to the spouses later
          // because we might not have parsed HUSB/WIFE yet, or we want to avoid linking to the @Fxxx@ ID directly
          // which doesn't exist as a node in the graph.
          if (!currentRecord.facts) currentRecord.facts = [];
          currentRecord.facts.push({ nodeId, label: linkLabel });
      } else {
          // Individual record: link immediately
          links.push({
              source: currentRecord.id,
              target: nodeId,
              type: 'event_link',
              label: linkLabel
          });
      }
  };

  const eventTags = [
    'BIRT', 'DEAT', 'MARR', 'OCCU', 'RESI', 'EDUC', 'EVEN',
    'BURI', 'CHR', 'BAPM', 'ADOP', 'IMMI', 'EMIG', 'NATU', 
    'CENS', 'PROB', 'WILL', 'GRAD', 'RETI', 'DIV', 'DIVF', 'CREM'
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const match = trimmedLine.match(/^(\d+)\s+(@\S+@|[^@\s]+)\s*(.*)$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const tagOrId = match[2];
    const value = match[3];

    // Level 0: New Record
    if (level === 0) {
      const id = tagOrId;
      const type = value;
      currentEvent = null;

      if (type === 'INDI') {
        currentRecord = { id, type: 'INDI' };
        individuals.set(id, { id, name: id.replace(/@/g, ''), type: 'person' }); 
      } else if (type === 'FAM') {
        currentRecord = { id, type: 'FAM', children: [], facts: [] };
        families.push(currentRecord);
      } else {
        currentRecord = null;
      }
    } 
    // Level 1: Attributes or Events
    else if (level === 1 && currentRecord) {
      const tag = tagOrId;
      
      // Handle Names
      if (currentRecord.type === 'INDI' && tag === 'NAME') {
        const name = value.replace(/\//g, '').trim();
        const indi = individuals.get(currentRecord.id);
        if (indi && name) {
          indi.name = name;
        }
      } 
      // Handle Family Structure
      else if (currentRecord.type === 'FAM') {
        if (tag === 'HUSB') currentRecord.husb = value;
        if (tag === 'WIFE') currentRecord.wife = value;
        if (tag === 'CHIL') currentRecord.children.push(value);
      }
      
      // Set context for Level 2 (e.g., inside a BIRT tag)
      if (eventTags.includes(tag)) {
          currentEvent = tag;
      } else {
          currentEvent = null;
      }

      // If advanced mode, capture Level 1 facts directly (like OCCU value)
      if (advancedMode && currentRecord.type === 'INDI') {
          if (tag === 'OCCU' && value) addFact(value, 'source', 'Occupation');
          if (tag === 'TITL' && value) addFact(value, 'source', 'Title');
      }
    } 
    // Level 2: Details (Date, Place, Source)
    else if (level === 2 && currentRecord && currentEvent && advancedMode) {
        const tag = tagOrId;
        if (tag === 'PLAC' && value) {
            addFact(value, 'place', 'at');
        } else if (tag === 'DATE' && value) {
            const yearMatch = value.match(/\d{4}/);
            if (yearMatch) {
                addFact(yearMatch[0], 'date', 'in');
            }
        } else if ((tag === 'SOUR' || tag === 'NOTE') && value) {
            addFact(value, 'source', 'source/note');
        }
    }
  }

  // --- Construct Links for Family Relations ---
  const nodeSet = new Set<string>(individuals.keys());

  for (const family of families) {
    // Parent nodes
    if (family.husb) nodeSet.add(family.husb);
    if (family.wife) nodeSet.add(family.wife);

    // Marriage link
    if (family.husb && family.wife) {
      links.push({ source: family.husb, target: family.wife, type: 'marriage' });
    }

    // Parent-Child links
    family.children.forEach(child => {
      nodeSet.add(child);
      if (family.husb) links.push({ source: family.husb, target: child, type: 'parent-child' });
      if (family.wife) links.push({ source: family.wife, target: child, type: 'parent-child' });
    });

    // Family Fact links (from Advanced Mode)
    // Link facts (like marriage date/place) to both husband and wife
    if (family.facts) {
        family.facts.forEach(fact => {
            if (family.husb) {
                links.push({ source: family.husb, target: fact.nodeId, type: 'event_link', label: fact.label });
            }
            if (family.wife) {
                links.push({ source: family.wife, target: fact.nodeId, type: 'event_link', label: fact.label });
            }
        });
    }
  }
  
  // Combine all nodes
  const nodes: NodeObject[] = [
      ...Array.from(nodeSet).map(id => individuals.get(id) || { id, type: 'person' as const }),
      ...Array.from(extraNodes.values())
  ];

  return { nodes, links };
};
