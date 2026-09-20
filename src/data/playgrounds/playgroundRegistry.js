import binarySearch from '../../playgrounds/BinarySearch/binarySearchPlayground.js';
import linearSearch from '../../playgrounds/LinearSearch/linearSearchPlayground.js';
import bubbleSort from '../../playgrounds/BubbleSort/bubbleSortPlayground.js';
import selectionSort from '../../playgrounds/SelectionSort/selectionSortPlayground.js';
import insertionSort from '../../playgrounds/InsertionSort/insertionSortPlayground.js';
import mergeSort from '../../playgrounds/MergeSort/mergeSortPlayground.js';
import quickSort from '../../playgrounds/QuickSort/quickSortPlayground.js';
import stack from '../../playgrounds/Stack/stackPlayground.js';
import queue from '../../playgrounds/Queue/queuePlayground.js';
import linkedList from '../../playgrounds/LinkedList/linkedListPlayground.js';
import binaryTree from '../../playgrounds/BinaryTree/binaryTreePlayground.js';
import bst from '../../playgrounds/BST/bstPlayground.js';
import traversals from '../../playgrounds/TreeTraversals/treeTraversalsPlayground.js';
import graphBasics from '../../playgrounds/GraphBasics/graphBasicsPlayground.js';
import bfs from '../../playgrounds/BFS/bfsPlayground.js';
import dfs from '../../playgrounds/DFS/dfsPlayground.js';

const registry = {
  'binary-search': binarySearch,
  'linear-search': linearSearch,
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
  stack,
  queue,
  'linked-list': linkedList,
  'binary-tree': binaryTree,
  'binary-search-tree': bst,
  'tree-traversals': traversals,
  'graph-basics': graphBasics,
  bfs,
  dfs,
};

export function getPlayground(slug) {
  return registry[slug] ?? null;
}

export default registry;
