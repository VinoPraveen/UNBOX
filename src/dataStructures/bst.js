import { createTreeNode, resetTreeIds } from './binaryTree.js';

export function buildBST(insertionOrder) {
  resetTreeIds();
  let root = null;
  for (const value of insertionOrder) {
    const result = insertInto(root, value);
    root = result.root;
  }
  return root;
}

export function insertInto(root, value) {
  if (!root) {
    return { root: createTreeNode(value), path: [], inserted: true, duplicate: false };
  }
  const path = [];
  let current = root;
  for (;;) {
    path.push(current);
    if (value === current.value) {
      return { root, path, inserted: false, duplicate: true };
    }
    if (value < current.value) {
      if (!current.left) {
        current.left = createTreeNode(value);
        return { root, path, inserted: true, duplicate: false, parent: current, side: 'left' };
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = createTreeNode(value);
        return { root, path, inserted: true, duplicate: false, parent: current, side: 'right' };
      }
      current = current.right;
    }
  }
}

export function searchBST(root, target) {
  const path = [];
  let current = root;
  let comparisons = 0;
  while (current) {
    path.push(current);
    comparisons += 1;
    if (target === current.value) {
      return { found: true, node: current, path, comparisons };
    }
    current = target < current.value ? current.left : current.right;
  }
  return { found: false, node: null, path, comparisons };
}

function findMin(node) {
  let current = node;
  const path = [current];
  while (current.left) {
    current = current.left;
    path.push(current);
  }
  return { min: current, path };
}

export function deleteFrom(root, value) {
  const search = searchBST(root, value);
  if (!search.found) {
    return { root, changed: false, reason: 'not-found', path: search.path };
  }
  const target = search.node;
  const hasLeft = Boolean(target.left);
  const hasRight = Boolean(target.right);

  if (!hasLeft && !hasRight) {
    return {
      root: removeNode(root, value),
      changed: true,
      case: 'leaf',
      target,
      path: search.path,
      successor: null,
    };
  }
  if ((hasLeft && !hasRight) || (!hasLeft && hasRight)) {
    return {
      root: removeNode(root, value),
      changed: true,
      case: 'one-child',
      target,
      path: search.path,
      successor: null,
      child: hasLeft ? target.left : target.right,
    };
  }
  const { min, path: successorPath } = findMin(target.right);
  const successorValue = min.value;
  const withoutSuccessor = removeNode(root, successorValue);
  const replaced = replaceValue(withoutSuccessor, value, successorValue);
  return {
    root: replaced,
    changed: true,
    case: 'two-children',
    target,
    path: search.path,
    successor: min,
    successorPath,
    successorValue,
  };
}

function removeNode(root, value) {
  if (!root) return null;
  if (value < root.value) {
    root.left = removeNode(root.left, value);
    return root;
  }
  if (value > root.value) {
    root.right = removeNode(root.right, value);
    return root;
  }
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  const { min } = findMin(root.right);
  root.value = min.value;
  root.right = removeNode(root.right, min.value);
  return root;
}

function replaceValue(root, oldValue, newValue) {
  if (!root) return null;
  if (oldValue < root.value) {
    root.left = replaceValue(root.left, oldValue, newValue);
    return root;
  }
  if (oldValue > root.value) {
    root.right = replaceValue(root.right, oldValue, newValue);
    return root;
  }
  root.value = newValue;
  return root;
}
