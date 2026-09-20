import { Network } from 'lucide-react';
import { buildLevelOrder } from '../../dataStructures/binaryTree.js';
import { generateTraversalSteps } from '../../algorithms/trees/traversals.js';
import { HEIGHT_NOTE } from '../../playgrounds/treeShared.js';

const DEFAULT_VALUES = [10, 5, 15, 2, 7, 12, 20];

function buildSteps() {
  const root = buildLevelOrder(DEFAULT_VALUES);
  return generateTraversalSteps(root, 'preorder');
}

const binaryTree = {
  slug: 'binary-tree',
  title: 'Binary Tree',
  category: 'Trees',
  difficulty: 'Beginner',
  estimatedTime: '8 min',
  description: 'A tree where each node can have at most two children. Learn ROOT, PARENT, CHILD, and LEAF.',
  Icon: Network,
  accent: '#A78BFA',
  tint: 'rgba(167, 139, 250, 0.1)',
  visualization: 'binary-tree',
  complexity: { time: 'O(n)', space: 'O(h)' },
  visualizationBlurb:
    'Build a tree from level-order values and watch traversals visit ROOT, PARENT, CHILDREN, and LEAVES.',
  overview: {
    heading: 'What is a Binary Tree?',
    body: 'A binary tree is a hierarchical data structure where each node can have at most two children: a left child and a right child. The top node is the ROOT. Nodes without children are LEAVES. Every other node is a PARENT of its children. Height counts levels: an empty tree has height 0 and a single node has height 1.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Values are read as level-order.',
        description:
          'The input 10, 5, 15, 2, 7, 12, 20 fills the tree top to bottom, left to right: 10 becomes the root, 5 and 15 its children, and so on.',
      },
      {
        number: 2,
        title: 'Each node has at most two children.',
        description:
          'A node can have 0, 1, or 2 children. Nodes with no children are leaves; nodes with children are parents.',
      },
      {
        number: 3,
        title: 'Traversals visit every node once.',
        description:
          'Preorder visits node-left-right, inorder visits left-node-right, postorder visits left-right-node, and level order visits level by level.',
      },
      {
        number: 4,
        title: 'Height measures the levels.',
        description: HEIGHT_NOTE,
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { heightNote: HEIGHT_NOTE },
};

export default binaryTree;
