import { Workflow } from 'lucide-react';
import { buildGraph } from '../../dataStructures/graph.js';
import { generateBfsSteps } from '../../algorithms/graphs/bfs.js';

const DEFAULT = buildGraph({
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edgePairs: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F']],
});

function buildSteps() {
  return generateBfsSteps(DEFAULT, 'A', null).steps;
}

const bfs = {
  slug: 'bfs',
  title: 'Breadth-First Search',
  category: 'Graphs',
  difficulty: 'Beginner',
  estimatedTime: '8 min',
  description: 'Explore a graph level by level with a QUEUE — first in, first out.',
  Icon: Workflow,
  accent: '#A78BFA',
  tint: 'rgba(167, 139, 250, 0.1)',
  visualization: 'bfs',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  visualizationBlurb:
    'Watch the queue drive the search: dequeue the front, visit it, enqueue its neighbors.',
  overview: {
    heading: 'What is BFS?',
    body: 'Breadth-first search explores a graph level by level using a QUEUE. It starts at a node, visits it, adds its unvisited neighbors to the back of the queue, then repeats from the front. A visited set prevents revisiting nodes, so cyclic graphs terminate correctly. Only the component reachable from the start is visited.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Queue the start node.',
        description: 'BFS begins by adding the start node to an empty queue.',
      },
      {
        number: 2,
        title: 'Remove the front and visit it.',
        description: 'The node at the FRONT of the queue is removed and marked visited.',
      },
      {
        number: 3,
        title: 'Enqueue unvisited neighbors.',
        description: 'Neighbors that were never visited join the BACK of the queue. Visited ones are skipped.',
      },
      {
        number: 4,
        title: 'Repeat until the queue is empty.',
        description: 'When nothing is left to process, every reachable node has been visited level by level.',
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { orderNote: 'Neighbors are visited in alphabetical order. BFS uses a QUEUE: first in, first out.' },
};

export default bfs;
