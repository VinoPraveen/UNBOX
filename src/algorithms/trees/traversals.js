import { cloneTree, countNodes, countLeaves, treeHeight } from '../../dataStructures/binaryTree.js';

export const TRAVERSAL_INFO = {
  preorder: {
    name: 'Preorder',
    rule: 'Visit the current node first, then traverse the left subtree, then the right subtree.',
  },
  inorder: {
    name: 'Inorder',
    rule: 'Traverse the left subtree, visit the current node, then traverse the right subtree.',
  },
  postorder: {
    name: 'Postorder',
    rule: 'Traverse the left subtree, then the right subtree, then visit the current node.',
  },
  level: {
    name: 'Level Order',
    rule: 'Visit nodes level by level from top to bottom, left to right.',
  },
};

export function serializeTree(root) {
  if (!root) return { nodes: [], rootId: null, width: 0, height: 0 };
  const nodes = [];
  let counter = 0;
  let maxDepth = 0;
  const walk = (node, depth) => {
    if (!node) return;
    walk(node.left, depth + 1);
    const x = counter;
    counter += 1;
    maxDepth = Math.max(maxDepth, depth);
    nodes.push({
      id: node.id,
      value: node.value,
      depth,
      x,
      leftId: node.left ? node.left.id : null,
      rightId: node.right ? node.right.id : null,
      isRoot: depth === 0,
      isLeaf: !node.left && !node.right,
    });
    walk(node.right, depth + 1);
  };
  walk(root, 0);
  return { nodes, rootId: root.id, width: counter, height: maxDepth + 1 };
}

export function treeStats(root) {
  return {
    nodes: countNodes(root),
    height: root ? treeHeight(root) : 0,
    leaves: countLeaves(root),
  };
}

function visitOrder(root, type) {
  const order = [];
  if (type === 'level') {
    if (!root) return order;
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return order;
  }
  const walk = (node) => {
    if (!node) return;
    if (type === 'preorder') order.push(node);
    walk(node.left);
    if (type === 'inorder') order.push(node);
    walk(node.right);
    if (type === 'postorder') order.push(node);
  };
  walk(root);
  return order;
}

function moveExplanation(type, node, index, order) {
  if (index === 0) {
    if (type === 'level') return `Start at the root. Visit ${node.value} first.`;
    if (type === 'preorder') return `Start at the root. Visit ${node.value} before its subtrees.`;
    if (type === 'inorder') return `Go left first, then visit ${node.value} when its left subtree is done.`;
    return `Finish both subtrees first, then visit ${node.value}.`;
  }
  const prev = order[index - 1];
  if (type === 'level') return `Move to the next node in the level. Previously visited ${prev.value}.`;
  if (node.value === prev.value) return `Visit ${node.value}.`;
  const sameParent = false;
  void sameParent;
  if (type === 'preorder') {
    if (prev.left === node || prev.right === node) {
      return `Move ${prev.left === node ? 'to the left child' : 'to the right child'} of ${prev.value}.`;
    }
    return `Left subtree completed. Return upward, then visit ${node.value}.`;
  }
  if (type === 'inorder') {
    return `Visit ${node.value}. Left subtree completed; the right subtree comes next.`;
  }
  return `Visit ${node.value}. Both of its subtrees (if any) are already done.`;
}

export function generateTraversalSteps(root, type = 'inorder') {
  const info = TRAVERSAL_INFO[type] ?? TRAVERSAL_INFO.inorder;
  const tree = cloneTree(root);
  const serialized = serializeTree(tree);
  const stats = treeStats(tree);
  const order = visitOrder(tree, type);
  const steps = [];
  const visited = [];

  const push = (fields) => {
    steps.push({
      key: steps.length + 1,
      badge: `Step ${steps.length + 1}`,
      tree: serialized,
      currentId: fields.currentId ?? null,
      visitedIds: [...visited],
      result: visited.map((n) => n.value),
      visitedCount: visited.length,
      totalCount: order.length,
      traversalType: type,
      traversalName: info.name,
      complete: Boolean(fields.complete),
      status: fields.status,
      heading: fields.heading,
      detail: fields.detail,
      stats,
    });
  };

  if (order.length === 0) {
    push({
      currentId: null,
      complete: true,
      status: 'The tree is empty — nothing to traverse.',
      heading: 'Empty tree.',
      detail: 'Build a tree first, then run a traversal to watch each visit.',
    });
    return steps;
  }

  push({
    currentId: null,
    complete: false,
    status: `${info.name} traversal · ${order.length} nodes · Press Play or Next to begin.`,
    heading: `${info.name} traversal.`,
    detail: info.rule,
  });

  order.forEach((node, index) => {
    visited.push(node);
    const last = index === order.length - 1;
    push({
      currentId: node.id,
      complete: last,
      status: last
        ? `✓ ${info.name} complete: ${visited.map((n) => n.value).join(' → ')}.`
        : `Visiting node ${node.value} (${index + 1} of ${order.length}).`,
      heading: last ? `${info.name} complete.` : `Visiting node ${node.value}.`,
      detail: last
        ? `${info.name} visited ${order.length} nodes: ${visited.map((n) => n.value).join(' → ')}. ${info.rule}`
        : moveExplanation(type, node, index, order),
    });
  });

  return steps;
}
