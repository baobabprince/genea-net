import { GraphData, NodeObject, LinkObject } from './types';

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

  const nodes: NodeObject[] = Array.from(nodeSet).map(id => ({ id }));
  return { nodes, links };
};

/**
 * Parses a .ged (GEDCOM) file content into a graph of family relationships.
 */
export const parseGedcom = (content: string): GraphData => {
  const individuals = new Map<string, { name: string }>();
  const families: { id: string; type: 'FAM', husb?: string; wife?: string; children: string[] }[] = [];
  const lines = content.split('\n');
  let currentRecord: any = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const match = trimmedLine.match(/^(\d+)\s+(@\S+@|[^@\s]+)\s*(.*)$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const tagOrId = match[2];
    const value = match[3];

    if (level === 0) {
      const id = tagOrId;
      const type = value;
      if (type === 'INDI') {
        currentRecord = { id, type: 'INDI' };
        individuals.set(id, { name: id.replace(/@/g, '') }); // Default name
      } else if (type === 'FAM') {
        currentRecord = { id, type: 'FAM', children: [] };
        families.push(currentRecord);
      } else {
        currentRecord = null;
      }
    } else if (level === 1 && currentRecord) {
      const tag = tagOrId;
      if (currentRecord.type === 'INDI' && tag === 'NAME') {
        const name = value.replace(/\//g, '').trim();
        const indi = individuals.get(currentRecord.id);
        if (indi && name) {
          indi.name = name;
        }
      } else if (currentRecord.type === 'FAM') {
        if (tag === 'HUSB') currentRecord.husb = value;
        if (tag === 'WIFE') currentRecord.wife = value;
        if (tag === 'CHIL') currentRecord.children.push(value);
      }
    }
  }

  const links: LinkObject[] = [];
  const nodeSet = new Set<string>(individuals.keys());

  for (const family of families) {
    const parents: string[] = [];
    if (family.husb) {
      parents.push(family.husb);
      nodeSet.add(family.husb);
    }
    if (family.wife) {
      parents.push(family.wife);
      nodeSet.add(family.wife);
    }

    if (family.husb && family.wife) {
      links.push({ source: family.husb, target: family.wife, type: 'marriage' });
    }

    family.children.forEach(child => {
      nodeSet.add(child);
      parents.forEach(parent => {
        links.push({ source: parent, target: child, type: 'parent-child' });
      });
    });
  }
  
  const nodes: NodeObject[] = Array.from(nodeSet).map(id => {
      const indi = individuals.get(id);
      return { id, name: indi ? indi.name : id.replace(/@/g, '') };
  });

  return { nodes, links };
};
