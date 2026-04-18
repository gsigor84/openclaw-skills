# InfraNodus Logic Specs: Skill Gap Analysis

## Co-occurrence Engine
- **Window Size**: 5 words (flexible).
- **Weighting**: Inverse distance between tokens.

## Structural Hole Detection
- **Metric**: Betweenness Centrality. Nodes with high betweenness but low degree centrality are flagged as potential **Brokers**.
- **Community Detection**: Louvain algorithm or simple connected components to find "Thematic Islands."

## Output Format
- **Gap Report**: Markdown table of Top 5 Clusters and the Structural Holes between them.
