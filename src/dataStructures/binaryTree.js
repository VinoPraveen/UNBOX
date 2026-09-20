let nodeId = 0;

export function createTreeNode(value, left = null, right = null) {
  nodeId += 1;
  return { id: `n${nodeId}`, value, left, right };
}

export function resetTreeIds() {
  nodeId = 0;
}

export function buildLevelOrder(values) {
  resetTreeIds();
  if (!Array.isArray(values) || values.length === 0) return null;
  const nodes = values.map((value) => createTreeNode(value));
  for (let i = 0; i < nodes.length; i += 1) {
    const leftIndex = 2 * i + 1;
    const rightIndex = 2 * i + 2;
    if (leftIndex < nodes.length) nodes[i].left = nodes[leftIndex];
    if (rightIndex < nodes.length) nodes[i].right = nodes[rightIndex];
  }
  return nodes[0];
}

export function cloneTree(root) {
  if (!root) return null;
  const map = new Map();
  const clone = (node) => {
    if (!node) return null;
    if (map.has(node.id)) return map.get(node.id);
    const copy = { id: node.id, value: node.value, left: null, right: null };
    map.set(node.id, copy);
    copy.left = clone(node.left);
    copy.right = clone(node.right);
    return copy;
  };
  return clone(root);
}

export function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

export function isLeafNode(node) {
  return Boolean(node) && !node.left && !node.right;
}

export function countLeaves(root) {
  if (!root) return 0;
  if (isLeafNode(root)) return 1;
  return countLeaves(root.left) + countLeaves(root.right);
}

// Height convention: number of LEVELS. Empty tree = 0, single node = 1.
// Documented in UI copy wherever height is shown.
export function treeHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

export function treeDepthOf(root, targetId, depth = 0) {
  if (!root) return -1;
  if (root.id === targetId) return depth;
  const left = treeDepthOf(root.left, targetId, depth + 1);
  if (left !== -1) return left;
  return treeDepthOf(root.right, targetId, depth + 1);
}

export function toLevelArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    out.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return out;
}

export function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.value <= min || root.value >= max) return false;
  return isValidBST(root.left, min, root.value) && isValidBST(root.right, root.value, max);
}

export function preorderValues(root) {
  if (!root) return [];
  return [root.value, ...preorderValues(root.left), ...preorderValues(root.right)];
}

export function inorderValues(root) {
  if (!root) return [];
  return [...inorderValues(root.left), root.value, ...inorderValues(root.right)];
}

export function postorderValues(root) {
  if (!root) return [];
  return [...postorderValues(root.left), ...postorderValues(root.right), root.value];
}

export function levelOrderValues(root) {
  return toLevelArray(root);
}
