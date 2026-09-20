import { GitFork } from 'lucide-react';
import { buildBST } from '../../dataStructures/bst.js';
import { generateTraversalSteps } from '../../algorithms/trees/traversals.js';
import { HEIGHT_NOTE } from '../../playgrounds/treeShared.js';

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80];

function buildSteps() {
  const root = buildBST(DEFAULT_VALUES);
  return generateTraversalSteps(root, 'inorder');
}

const binarySearchTree = {
  slug: 'binary-search-tree',
  title: 'Binary Search Tree',
  category: 'Trees',
  difficulty: 'Intermediate',
  estimatedTime: '10 min',
  description:
    'A binary tree where values smaller than a node go left and larger values go right. Duplicate values are not inserted.',
  Icon: GitFork,
  accent: '#22D3EE',
  tint: 'rgba(34, 211, 238, 0.1)',
  visualization: 'binary-search-tree',
  complexity: { time: 'O(log n)', space: 'O(n)' },
  visualizationBlurb:
    'Insert, search, and delete with the rule LEFT < ROOT < RIGHT. Inorder traversal of a BST yields sorted values.',
  overview: {
    heading: 'What is a Binary Search Tree?',
    body: 'A binary search tree (BST) is a binary tree where values smaller than a node are placed in its left subtree and larger values in its right subtree. This ordering makes search, insert, and delete fast on average: each comparison discards half of the remaining tree. Duplicate values are not inserted. Inorder traversal of a BST produces values in ascending order.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Compare at each node.',
        description:
          'Start at the root. If the value is smaller, move LEFT; if larger, move RIGHT; if equal, stop.',
      },
      {
        number: 2,
        title: 'Insert at the empty spot.',
        description:
          'Follow comparisons until a missing child is found, then attach the new leaf there. Duplicates are rejected.',
      },
      {
        number: 3,
        title: 'Search follows the same path.',
        description:
          'Searching repeats the comparisons. The visited nodes form the search path, ending at the target or NULL.',
      },
      {
        number: 4,
        title: 'Delete handles three cases.',
        description:
          'Leaf: remove it. One child: bypass it. Two children: replace with the inorder successor, then remove the original successor.',
      },
    ],
  },
  visualizationSteps: buildSteps(),
  visualizationConfig: { heightNote: HEIGHT_NOTE },
};

export default binarySearchTree;
