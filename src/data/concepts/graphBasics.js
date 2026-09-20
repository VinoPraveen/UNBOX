import { Share2 } from 'lucide-react';
import { buildGraph } from '../../dataStructures/graph.js';
import { singleGraphStep } from '../../playgrounds/graphShared.js';

const DEFAULT = buildGraph({
  nodes: ['A', 'B', 'C', 'D'],
  edgePairs: [['A', 'B'], ['A', 'C'], ['B', 'D']],
});

function buildSteps() {
  return singleGraphStep(DEFAULT, {
    status: 'Undirected · 4 nodes · 3 edges — A—B, A—C, B—D.',
    heading: 'A small undirected graph.',
    detail:
      'A vertex is a node in a graph; an edge is a connection between two vertices. Here A connects to B and C, and B connects to D. Undirected edges are two-way: A lists B as a neighbor and B lists A.',
  });
}

const graphBasics = {
  slug: 'graph-basics',
  title: 'Graph Basics',
  category: 'Graphs',
  difficulty: 'Beginner',
  estimatedTime: '6 min',
  description: 'Learn VERTEX, EDGE, directed vs undirected graphs, and optional weights.',
  Icon: Share2,
  accent: '#22D3EE',
  tint: 'rgba(34, 211, 238, 0.1)',
  visualization: 'graph-basics',
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
  visualizationBlurb:
    'See vertices and edges, then compare undirected, directed, and weighted connections.',
  overview: {
    heading: 'What is a Graph?',
    body: 'A graph is a set of vertices (nodes) connected by edges. An edge represents adjacency: two vertices sharing an edge are neighbors. In an undirected graph every edge is a two-way relationship; in a directed graph each edge points one way. Edges can carry an optional weight — a cost for traveling that connection.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'A vertex is a node.',
        description: 'Each labeled circle is a vertex. It holds no position in the model — only its connections matter.',
      },
      {
        number: 2,
        title: 'An edge connects two vertices.',
        description: 'Two vertices sharing an edge are adjacent (neighbors). Removing a vertex removes its edges too.',
      },
      {
        number: 3,
        title: 'Directed edges point one way.',
        description: 'A ──→ B means A reaches B, but B does not reach A unless an edge points back.',
      },
      {
        number: 4,
        title: 'Weights are optional costs.',
        description: 'An edge can carry a number, e.g. A ── 5 ── B. BFS and DFS ignore weights; they only follow connections.',
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { orderNote: 'Neighbors are listed in alphabetical order.' },
};

export default graphBasics;
