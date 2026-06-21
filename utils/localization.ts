export type Language = 'he' | 'en';

export type TranslationKey = keyof typeof translations['he'];

export const translations = {
  he: {
    // App Header and Loading states
    title: 'מנתח רשתות גנאלוגי',
    readyToDisplayHeader: 'מוכן להצגה',
    readyToDisplaySubtitle: 'העלה קובץ GEDCOM או רשימת קשרים כדי להתחיל בחישוב המדדים.',
    analysisComplete: 'הניתוח הושלם בהצלחה.',
    communitiesDetected: 'זוהו {count} קהילות ברשת.',
    loadedFile: 'נטען בהצלחה: {name}',
    loadedSample: 'נטענה דוגמה: {name}',

    // General Control Panel UI
    uploadFile: 'העלאת קובץ',
    advancedMode: 'מצב ניתוח מתקדם',
    addPlacesAndDates: 'הוספת מקומות ותאריכים',
    calculateMetrics: 'חשב מדדים',
    calculating: 'מנתח...',
    communities: 'קהילות',
    detecting: 'מזהה...',
    searchNode: 'חפש צומת...',
    selectedNodeType: 'צומת נבחר: {type}',
    nodeStats: 'נתוני צומת',

    // Node Metrics Description
    degree: 'דרגת קשר (Degree)',
    reachability: 'נגישות ברשת',
    averageDistance: 'מרחק ממוצע',
    eccentricity: 'אקסצנטריות',
    clusteringCoefficient: 'מקדם צבירה',

    // Section 1: Network Summary
    networkSummaryTitle: '1. סיכום רשת',
    totalNodes: 'סה״כ צמתים',
    totalEdges: 'סה״כ קשרים',
    averageDegree: 'דרגה ממוצעת',
    averageDegreeTooltip: 'מספר הקשרים הממוצע לכל צומת ברשת.',
    networkDensity: 'צפיפות הרשת',
    networkDensityTooltip: 'היחס בין קשרים קיימים לאפשריים.',
    transitivity: 'טרנזיטיביות',
    transitivityTooltip: 'הסיכוי ששני שכנים של צומת מסוים מחוברים גם ביניהם (מקדם צבירה גלובלי).',
    connectedComponents: 'רכיבי קישוריות',
    connectedComponentsTooltip: 'מספר תת-קבוצות מנותקות ברשת.',
    identifiedCommunities: 'קהילות שזוהו',

    // Section 2: Topology & Distance
    topologyTitle: '2. טופולוגיה וממנה',
    diameter: 'קוטר (Diameter)',
    diameterTooltip: 'המרחק המקסימלי בין שני צמתים ברשת.',
    radius: 'רדיוס (Radius)',
    radiusTooltip: 'המרחק המינימלי שבו צומת כלשהו נמצא מכל שאר הצמתים.',
    largestComponentSize: 'גודל רכיב ראשי',
    centerNodes: 'צמתי מרכז (Center):',
    centerNodesTooltip: 'הצמתים הנגישים ביותר ברשת (בעלי האקסצנטריות המינימלית). בעצי משפחה לרוב יהיו 1-2 בלבד.',
    peripheryNodes: 'צמתי פריפריה (Periphery):',
    peripheryNodesTooltip: 'הצמתים המרוחקים ביותר ברשת (מרחקם שווה לקוטר הגרף).',
    criticalNodes: 'צמתים קריטיים (Articulation):',
    criticalNodesTooltip: 'צמתים שהסרתם תגרום לפירוק הרשת למספר רכיבים מנותקים.',

    // Section 3: Degree Distribution
    degreeDistributionTitle: 'התפלגות קשרים',
    logarithmic: 'לוגריתמי',
    linear: 'ליניארי',
    modeDegree: 'דרגה שכיחה: ',
    avgDegreeBar: 'דרגה ממוצעת: ',
    nodesText: 'צמתים',
    connectionsText: 'קשרים',

    // Section 4: Genealogical Structure
    genealogyTitle: '4. מבנה גנאלוגי',
    pedigreeCollapse: 'קריסת שושלת (PCI)',
    pedigreeCollapseTooltip: 'מדד לזיווג קרובי משפחה. ערך גבוה מעיד על הופעת אבות קדמונים משותפים במספר ענפים.',
    collapseOccurrences: 'אירועי קריסה מזוהים',
    collapseOccurrencesTooltip: 'המספר הכולל של צמתים המהווים אבות קדמונים משותפים בקרב זוגות הורים.',
    branchingFactor: 'מקדם הסתעפות',
    branchingFactorTooltip: 'ממוצע הצאצאים לכל הורה שתועד. מדד לקצב הגידול של המשפחה.',
    generationDepthMax: 'עומק דורות (Max)',
    generationDepthMaxTooltip: 'מספר הדורות המקסימלי מאב קדמון לצאצא האחרון שלו.',
    averageGenerationWidth: 'רוחב דור ממוצע',
    leafDepth: 'עומק ענפים (Leaf Depth)',
    surnameDiversity: 'מגוון שמות משפחה',
    surnameDiversityTooltip: 'היחס בין מספר שמות המשפחה השונים למספר האנשים. יחס נמוך מעיד על שושלת סגורה.',

    // Section 5: Centrality & Influence Rankings
    centralityTitle: '5. דירוגי השפעה ומרכזיות',
    betweennessRankTitle: 'מרכזיות ביניים (מתווכים)',
    degreeRankTitle: 'מרכזיות דרגה (פופולריות)',
    descendantsRankTitle: 'מספר צאצאים כולל',
    ancestorsRankTitle: 'מספר אבות קדמונים',

    // Section 6: Gemini AI
    geminiAiTitle: 'תובנות Gemini AI',
    geminiButtonText: 'תובנות Gemini AI',
    analyzingPatterns: 'מנתח תבניות...',
    systemicAnalysisSubject: 'ניתוח מערכתי',
    billingInfoText: 'מידע על חיוב ושימוש במפתחות בתשלום',
    noInsights: 'לא נוצרו תובנות.',
    apiError: 'מפתח ה-API לא תקף. אנא בחר מפתח חדש.',
    generationFailed: 'הפקת תובנות AI נכשלה.',

    // Legend
    legendTitle: 'מקרא',
    legendParentChild: 'קשר הורה-ילד',
    legendMarriage: 'קשר נישואין',
    legendPerson: 'אדם',
    legendPlace: 'מקום',
    legendDate: 'תאריך',
    legendSource: 'מקור מידע',
    legendEventLink: 'קשר לאירוע',
    legendNode: 'צומת',
    legendLink: 'קשר',
    legendDifferentCommunities: 'קהילות שונות',
  },
  en: {
    // App Header and Loading states
    title: 'Genealogical Network Analyzer',
    readyToDisplayHeader: 'Ready to Display',
    readyToDisplaySubtitle: 'Upload a GEDCOM file or an edge list to begin calculating network metrics.',
    analysisComplete: 'Analysis completed successfully.',
    communitiesDetected: 'Detected {count} communities in the network.',
    loadedFile: 'Successfully loaded: {name}',
    loadedSample: 'Loaded sample: {name}',

    // General Control Panel UI
    uploadFile: 'Upload File',
    advancedMode: 'Advanced Analysis Mode',
    addPlacesAndDates: 'Add places and dates',
    calculateMetrics: 'Calculate Metrics',
    calculating: 'Analyzing...',
    communities: 'Communities',
    detecting: 'Detecting...',
    searchNode: 'Search node...',
    selectedNodeType: 'Selected Node: {type}',
    nodeStats: 'Node Stats',

    // Node Metrics Description
    degree: 'Degree (Connections)',
    reachability: 'Network Reachability',
    averageDistance: 'Average Distance',
    eccentricity: 'Eccentricity',
    clusteringCoefficient: 'Clustering Coefficient',

    // Section 1: Network Summary
    networkSummaryTitle: '1. Network Summary',
    totalNodes: 'Total Nodes',
    totalEdges: 'Total Edges',
    averageDegree: 'Average Degree',
    averageDegreeTooltip: 'The average number of links for each node in the network.',
    networkDensity: 'Network Density',
    networkDensityTooltip: 'The ratio of existing edges to all possible edges.',
    transitivity: 'Transitivity',
    transitivityTooltip: 'The probability that two neighbors of a node are also connected (global clustering coefficient).',
    connectedComponents: 'Connected Components',
    connectedComponentsTooltip: 'Number of disconnected groups in the network.',
    identifiedCommunities: 'Identified Communities',

    // Section 2: Topology & Distance
    topologyTitle: '2. Topology & Distance',
    diameter: 'Diameter',
    diameterTooltip: 'The maximum distance between any two nodes in the network.',
    radius: 'Radius',
    radiusTooltip: 'The minimum distance of a node to all other nodes.',
    largestComponentSize: 'Largest Component Size',
    centerNodes: 'Center Nodes:',
    centerNodesTooltip: 'The most accessible nodes in the network (minimum eccentricity). In family trees, there are usually only 1-2.',
    peripheryNodes: 'Periphery Nodes:',
    peripheryNodesTooltip: 'The nodes furthest away in the network (eccentricity equals graph diameter).',
    criticalNodes: 'Critical Nodes (Articulation):',
    criticalNodesTooltip: 'Nodes whose removal would disconnect the network into multiple components.',

    // Section 3: Degree Distribution
    degreeDistributionTitle: 'Degree Distribution',
    logarithmic: 'Logarithmic',
    linear: 'Linear',
    modeDegree: 'Mode Degree: ',
    avgDegreeBar: 'Average Degree: ',
    nodesText: 'nodes',
    connectionsText: 'connections',

    // Section 4: Genealogical Structure
    genealogyTitle: '4. Genealogical Structure',
    pedigreeCollapse: 'Pedigree Collapse (PCI)',
    pedigreeCollapseTooltip: 'A measure of intermarriage. A high value indicates shared ancestors appearing in multiple branches.',
    collapseOccurrences: 'Identified Collapse Events',
    collapseOccurrencesTooltip: 'The total number of nodes that are shared ancestors between parent pairs.',
    branchingFactor: 'Branching Factor',
    branchingFactorTooltip: 'Average number of children recorded per parent. Shows growth rate.',
    generationDepthMax: 'Generation Depth (Max)',
    generationDepthMaxTooltip: 'Maximum number of generations from an ancestor to their furthest descendant.',
    averageGenerationWidth: 'Avg Generation Width',
    leafDepth: 'Avg Leaf Depth',
    surnameDiversity: 'Surname Diversity',
    surnameDiversityTooltip: 'Ratio of unique surnames to total population. Lower ratio indicates a more closed lineage.',

    // Section 5: Centrality & Influence Rankings
    centralityTitle: '5. Centrality & Influence Rankings',
    betweennessRankTitle: 'Betweenness Centrality (Intermediaries)',
    degreeRankTitle: 'Degree Centrality (Popularity)',
    descendantsRankTitle: 'Total Descendants Count',
    ancestorsRankTitle: 'Total Ancestors Count',

    // Section 6: Gemini AI
    geminiAiTitle: 'Gemini AI Insights',
    geminiButtonText: 'Gemini AI Insights',
    analyzingPatterns: 'Analyzing patterns...',
    systemicAnalysisSubject: 'Systemic Analysis',
    billingInfoText: 'Info on billing and paid API key usage',
    noInsights: 'No insights generated.',
    apiError: 'Invalid API key. Please select a new key.',
    generationFailed: 'Failed to generate AI insights.',

    // Legend
    legendTitle: 'Legend',
    legendParentChild: 'Parent-Child Link',
    legendMarriage: 'Marriage Link',
    legendPerson: 'Person',
    legendPlace: 'Place',
    legendDate: 'Date',
    legendSource: 'Source',
    legendEventLink: 'Event Link',
    legendNode: 'Node',
    legendLink: 'Link',
    legendDifferentCommunities: 'Different Communities',
  }
};

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations['he'][key] || String(key);
};
