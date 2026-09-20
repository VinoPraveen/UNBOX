import { Route } from 'lucide-react';
import { buildLevelOrder } from '../../dataStructures/binaryTree.js';
import { generateTraversalSteps } from '../../algorithms/trees/traversals.js';
import { HEIGHT_NOTE } from '../../playgrounds/treeShared.js';

const DEFAULT_VALUES = [10, 5, 15, 2, 7, 12, 20];

function buildSteps() {
  const root = buildLevelOrder(DEFAULT_VALUES);
  return generateTraversalSteps(root, 'inorder');
}

const treeTraversals = {
  slug: 'tree-traversals',
  title: 'Tree Traversals',
  category: 'Trees',
  difficulty: 'Beginner',
  estimatedTime: '7 min',
  description:
    'Traversal is the process of visiting every node in a tree according to a specific order.',
  Icon: Route,
  accent: '#A3FF12',
  tint: 'rgba(163, 255, 18, 0.08)',
  visualization: 'tree-traversals',
  complexity: { time: 'O(n)', space: 'O(h)' },
  visualizationBlurb:
    'Run Preorder, Inorder, Postorder, and Level Order on one shared tree and compare the visit order.',
  overview: {
    heading: 'What is Tree Traversal?',
    body: 'Traversal is the process of visiting every node in a tree according to a specific order. Preorder visits the node first (10 → 5 → 2 → 7 → 15 → 12 → 20), inorder visits left-node-right (2 → 5 → 7 → 10 → 12 → 15 → 20), postorder visits children first (2 → 7 → 5 → 12 → 20 → 15 → 10), and level order visits level by level (10 → 5 → 15 → 2 → 7 → 12 → 20).',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Preorder: node first.',
        description:
          'Visit the current node first, then traverse the left subtree, then the right subtree.',
      },
      {
        number: 2,
        title: 'Inorder: node in the middle.',
        description:
          'Traverse the left subtree, visit the current node, then traverse the right subtree.',
      },
      {
        number: 3,
        title: 'Postorder: node last.',
        description:
          'Traverse the left subtree, then the right subtree, then visit the current node.',
      },
      {
        number: 4,
        title: 'Level order: level by level.',
        description: 'Visit nodes level by level from top to bottom, left to right.',
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { heightNote: HEIGHT_NOTE },
};

export default treeTraversals;
