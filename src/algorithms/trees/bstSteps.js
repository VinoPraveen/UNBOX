import { serializeTree, treeStats } from './traversals.js';
import { cloneTree } from '../../dataStructures/binaryTree.js';
import { insertInto, searchBST, deleteFrom } from '../../dataStructures/bst.js';

function baseStep(index, fields) {
  return {
    key: index,
    badge: `Step ${index}`,
    tree: fields.tree,
    currentId: fields.currentId ?? null,
    pathIds: fields.pathIds ?? [],
    visitedIds: fields.visitedIds ?? [],
    result: fields.result ?? [],
    complete: Boolean(fields.complete),
    status: fields.status,
    heading: fields.heading,
    detail: fields.detail,
    stats: fields.stats,
    phase: fields.phase,
  };
}

export function generateInsertSteps(root, value) {
  const tree = cloneTree(root);
  const serialized0 = serializeTree(tree);
  const stats0 = treeStats(tree);
  const steps = [];
  let key = 1;
  const push = (fields) => {
    steps.push(baseStep(key, fields));
    key += 1;
  };

  if (!tree) {
    const { root: grown } = insertInto(null, value);
    push({
      tree: serializeTree(grown),
      currentId: grown.id,
      pathIds: [grown.id],
      complete: true,
      phase: 'place',
      stats: treeStats(grown),
      status: `✓ Inserted ${value} as the root.`,
      heading: `Inserted ${value}.`,
      detail: `The tree was empty, so ${value} becomes the root. ROOT nodes have no parent.`,
    });
    return { steps, root: grown, inserted: true };
  }

  push({
    tree: serialized0,
    currentId: serialized0.rootId,
    pathIds: [],
    complete: false,
    phase: 'compare',
    stats: stats0,
    status: `Insert ${value} · start at the root and compare at each node.`,
    heading: `Insert ${value}.`,
    detail: `BST rule: LEFT < node < RIGHT. Compare ${value} at each node and move left or right until an empty spot is found.`,
  });

  const path = [];
  let current = tree;
  while (current) {
    path.push(current.id);
    if (value === current.value) {
      push({
        tree: serializeTree(tree),
        currentId: current.id,
        pathIds: [...path],
        complete: true,
        phase: 'duplicate',
        stats: treeStats(tree),
        status: `${value} already exists — duplicates are not inserted.`,
        heading: 'Duplicate value.',
        detail: `Node ${current.value} already holds ${value}. Duplicate values are not inserted; the tree is unchanged.`,
      });
      return { steps, root: tree, inserted: false, duplicate: true };
    }
    const goLeft = value < current.value;
    push({
      tree: serializeTree(tree),
      currentId: current.id,
      pathIds: [...path],
      complete: false,
      phase: 'compare',
      stats: treeStats(tree),
      status: `${value} ${goLeft ? '<' : '>'} ${current.value} — move ${goLeft ? 'LEFT' : 'RIGHT'}.`,
      heading: `${value} ${goLeft ? 'is less than' : 'is greater than'} ${current.value}.`,
      detail: goLeft
        ? `${value} < ${current.value}, so the target can only live in the left subtree of ${current.value}. Move LEFT.`
        : `${value} > ${current.value}, so the target can only live in the right subtree of ${current.value}. Move RIGHT.`,
    });
    const next = goLeft ? current.left : current.right;
    if (!next) {
      const { root: grown } = insertInto(tree, value);
      const grownSerialized = serializeTree(grown);
      const insertedNode = grownSerialized.nodes.find(
        (n) => !serialized0.nodes.some((o) => o.id === n.id)
      );
      push({
        tree: grownSerialized,
        currentId: insertedNode ? insertedNode.id : null,
        pathIds: [...path, insertedNode ? insertedNode.id : null].filter(Boolean),
        complete: true,
        phase: 'place',
        stats: treeStats(grown),
        status: `✓ Inserted ${value} as the ${goLeft ? 'left' : 'right'} child of ${current.value}.`,
        heading: `Placed ${value}.`,
        detail: `${value} becomes the ${goLeft ? 'left' : 'right'} child of ${current.value}. It is a LEAF — it has no children yet. Compared ${path.length} nodes.`,
      });
      return { steps, root: grown, inserted: true, comparisons: path.length };
    }
    current = next;
  }
  return { steps, root: tree, inserted: false };
}

export function generateSearchSteps(root, target) {
  const tree = cloneTree(root);
  const steps = [];
  let key = 1;
  const push = (fields) => {
    steps.push(baseStep(key, fields));
    key += 1;
  };

  if (!tree) {
    push({
      tree: serializeTree(null),
      currentId: null,
      pathIds: [],
      complete: true,
      phase: 'miss',
      stats: treeStats(null),
      status: 'The tree is empty — nothing to search.',
      heading: 'Empty tree.',
      detail: 'Insert values first, then search for a target.',
    });
    return { steps, found: false, path: [] };
  }

  const serialized = serializeTree(tree);
  push({
    tree: serialized,
    currentId: serialized.rootId,
    pathIds: [],
    complete: false,
    phase: 'compare',
    stats: treeStats(tree),
    status: `Search ${target} · start at the root.`,
    heading: `Search ${target}.`,
    detail: `Compare ${target} at each node: go LEFT when smaller, RIGHT when larger, stop when equal.`,
  });

  const result = searchBST(tree, target);
  const pathIds = result.path.map((n) => n.id);
  result.path.forEach((node, index) => {
    const last = index === result.path.length - 1;
    if (node.value === target) {
      push({
        tree: serializeTree(tree),
        currentId: node.id,
        pathIds,
        complete: true,
        phase: 'found',
        stats: { ...treeStats(tree), checked: result.comparisons, pathLength: pathIds.length },
        status: `✓ ${target} = ${node.value} — FOUND after ${result.comparisons} checks.`,
        heading: `Found ${target}.`,
        detail: `Search path: ${result.path.map((n) => n.value).join(' → ')}. Checked ${result.comparisons} nodes.`,
      });
      return;
    }
    const goLeft = target < node.value;
    if (!last) {
      push({
        tree: serializeTree(tree),
        currentId: node.id,
        pathIds: result.path.slice(0, index + 1).map((n) => n.id),
        complete: false,
        phase: 'compare',
        stats: treeStats(tree),
        status: `${target} ${goLeft ? '<' : '>'} ${node.value} — move ${goLeft ? 'LEFT' : 'RIGHT'}.`,
        heading: `${target} ${goLeft ? 'is less than' : 'is greater than'} ${node.value}.`,
        detail: `Move ${goLeft ? 'LEFT' : 'RIGHT'} from ${node.value}. Search path so far: ${result.path.slice(0, index + 1).map((n) => n.value).join(' → ')}.`,
      });
    } else {
      push({
        tree: serializeTree(tree),
        currentId: node.id,
        pathIds,
        complete: true,
        phase: 'miss',
        stats: { ...treeStats(tree), checked: result.comparisons, pathLength: pathIds.length },
        status: `${target} is not present — reached NULL after ${result.comparisons} checks.`,
        heading: 'Target not found.',
        detail: `Search path: ${result.path.map((n) => n.value).join(' → ')} → null. ${target} was never equal to a node value.`,
      });
    }
  });

  return { steps, found: result.found, path: result.path.map((n) => n.value) };
}

export function generateDeleteSteps(root, value) {
  const tree = cloneTree(root);
  const steps = [];
  let key = 1;
  const push = (fields) => {
    steps.push(baseStep(key, fields));
    key += 1;
  };

  if (!tree) {
    push({
      tree: serializeTree(null),
      currentId: null,
      pathIds: [],
      complete: true,
      phase: 'miss',
      stats: treeStats(null),
      status: 'The tree is empty — nothing to delete.',
      heading: 'Empty tree.',
      detail: 'Insert values first, then delete a node.',
    });
    return { steps, root: tree, changed: false };
  }

  const serialized = serializeTree(tree);
  push({
    tree: serialized,
    currentId: serialized.rootId,
    pathIds: [],
    complete: false,
    phase: 'find',
    stats: treeStats(tree),
    status: `Delete ${value} · first find the target node.`,
    heading: `Delete ${value}.`,
    detail: `TARGET NODE ↓ CHILDREN ↓ CASE ↓ SUCCESSOR ↓ REPLACEMENT ↓ FINAL TREE. Start by finding ${value}.`,
  });

  const deletion = deleteFrom(cloneTree(root), value);
  if (!deletion.changed) {
    push({
      tree: serializeTree(tree),
      currentId: null,
      pathIds: (deletion.path ?? []).map((n) => n.id),
      complete: true,
      phase: 'miss',
      stats: treeStats(tree),
      status: `${value} is not in the tree — nothing deleted.`,
      heading: 'Value not found.',
      detail: `Searched ${(deletion.path ?? []).map((n) => n.value).join(' → ') || '—'} and reached NULL. The tree is unchanged.`,
    });
    return { steps, root: tree, changed: false };
  }

  const targetId = deletion.target ? deletion.target.id : null;
  const pathIds = (deletion.path ?? []).map((n) => n.id);
  const caseName =
    deletion.case === 'leaf'
      ? 'CASE 1 — leaf (no children)'
      : deletion.case === 'one-child'
        ? 'CASE 2 — one child'
        : 'CASE 3 — two children';

  push({
    tree: serializeTree(tree),
    currentId: targetId,
    pathIds,
    complete: false,
    phase: 'case',
    stats: treeStats(tree),
    status: `Found ${value}. ${caseName}.`,
    heading: `Found ${value} — ${caseName}.`,
    detail:
      deletion.case === 'leaf'
        ? `${value} has no children, so it is a LEAF. Simply remove it.`
        : deletion.case === 'one-child'
          ? `${value} has one child (${deletion.child ? deletion.child.value : '—'}). Bypass ${value} by linking its parent directly to its child.`
          : `${value} has two children. Find the inorder successor (smallest node in the right subtree), copy its value, then remove the original successor node.`,
  });

  if (deletion.case === 'two-children') {
    const successorId = deletion.successor ? deletion.successor.id : null;
    push({
      tree: serializeTree(tree),
      currentId: successorId,
      pathIds,
      complete: false,
      phase: 'successor',
      stats: treeStats(tree),
      status: `Successor of ${value} is ${deletion.successorValue}.`,
      heading: `Successor = ${deletion.successorValue}.`,
      detail: `The inorder successor is the smallest value larger than ${value}: walk right once, then left as far as possible. Replace ${value} with ${deletion.successorValue}, then remove the original ${deletion.successorValue} node.`,
    });
  }

  push({
    tree: serializeTree(deletion.root),
    currentId: null,
    pathIds: [],
    complete: true,
    phase: 'done',
    stats: treeStats(deletion.root),
    status: `✓ Deleted ${value}. The tree remains a valid BST.`,
    heading: `Deleted ${value}.`,
    detail:
      deletion.case === 'leaf'
        ? `${value} was a leaf, so removing it keeps every other relationship intact.`
        : deletion.case === 'one-child'
          ? `${value} was bypassed: its parent now points to its child.`
          : `${value} was replaced with ${deletion.successorValue} and the duplicate successor removed. Inorder traversal still yields sorted values.`,
  });

  return { steps, root: deletion.root, changed: true, case: deletion.case };
}
