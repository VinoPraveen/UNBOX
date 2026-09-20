import { Waypoints } from 'lucide-react';
import { buildGraph } from '../../dataStructures/graph.js';
import { generateDfsSteps } from '../../algorithms/graphs/dfs.js';

const DEFAULT = buildGraph({
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edgePairs: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E']],
});

function buildSteps() {
  return generateDfsSteps(DEFAULT, 'A', null).steps;
}

const dfs = {
  slug: 'dfs',
  title: 'Depth-First Search',
  category: 'Graphs',
  difficulty: 'Beginner',
  estimatedTime: '8 min',
  description: 'Go deep with a STACK, backtracking at dead ends — last in, first out.',
  Icon: Waypoints,
  accent: '#A3FF12',
  tint: 'rgba(163, 255, 18, 0.08)',
  visualization: 'dfs',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  visualizationBlurb:
    'Watch the stack drive the search: pop the top, go deeper, backtrack when stuck.',
  overview: {
    heading: 'What is DFS?',
    body: 'Depth-first search explores a graph by going as deep as possible before backtracking, using a STACK. It pops the top node, visits it, and pushes its unvisited neighbors — so the most recently discovered node is explored next. When a node has no unvisited neighbors, the search backtracks to the top of the stack. BFS uses a queue and explores level by level; DFS uses a stack and explores depth first.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Push the start node.',
        description: 'DFS begins by pushing the start node onto an empty stack.',
      },
      {
        number: 2,
        title: 'Pop the top and go deeper.',
        description: 'The node on TOP of the stack is popped and explored immediately.',
      },
      {
        number: 3,
        title: 'Push unvisited neighbors.',
        description: 'Fresh neighbors are pushed so the search continues deeper instead of wider.',
      },
      {
        number: 4,
        title: 'Backtrack at dead ends.',
        description: 'A node with no unvisited neighbors is finished — return to the top of the stack and continue.',
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { orderNote: 'Neighbors are explored in alphabetical order using an explicit STACK: last in, first out.' },
};

export default dfs;
