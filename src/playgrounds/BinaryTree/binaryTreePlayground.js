import createTreePlaygroundRenderer from '../TreePlayground.jsx';
import { getAlgorithm } from '../../algorithms/registry.js';
import { buildLevelOrder } from '../../dataStructures/binaryTree.js';
import { generateTraversalSteps } from '../../algorithms/trees/traversals.js';
import {
  HEIGHT_NOTE,
  baseTreeState,
  parseLevelOrder,
  pushTreeHistory,
  randomLevelTree,
  undoTreeState,
  validateLevelOrder,
} from '../treeShared.js';

const SLUG = 'binary-tree';
const algorithm = () => getAlgorithm(SLUG);
const Renderer = createTreePlaygroundRenderer({
  vizSlug: SLUG,
  title: 'Binary Tree',
  complexity: { time: 'O(n)', space: 'O(h)' },
  heightNote: HEIGHT_NOTE,
});

function freshRunId() {
  return `tree-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const TRAVERSAL_OPS = ['preorder', 'inorder', 'postorder', 'level'];

function runTraversal(state, type, setExperiment, setStatus) {
  const root = buildLevelOrder(state.values);
  if (!root) {
    setStatus({
      kind: 'error',
      title: 'The tree is empty.',
      detail: 'Build a tree from level-order values first.',
    });
    return;
  }
  const steps = generateTraversalSteps(root, type);
  const order = steps.length > 0 ? (steps[steps.length - 1].result ?? []) : [];
  setExperiment({
    ...state,
    steps,
    traversalType: type,
    lastOp: type,
    lastMessage: `${steps[steps.length - 1]?.heading ?? 'Traversal complete.'}`,
    meta: { action: type },
    runId: freshRunId(),
  });
  setStatus({
    kind: 'success',
    title: `${type === 'level' ? 'Level order' : type[0].toUpperCase() + type.slice(1)} complete.`,
    detail: `Visited ${order.length} nodes: ${order.join(' → ')}.`,
  });
}

const binaryTree = {
  slug: SLUG,
  title: 'Binary Tree',
  description:
    'Build a binary tree from level-order values. See ROOT, PARENT, CHILDREN, and LEAVES, then watch traversals visit each node.',
  experience: 'full',
  conceptSlug: 'binary-tree',
  algorithmSlug: SLUG,
  persistent: true,
  inputs: [
    {
      id: 'values',
      label: 'Level-order values',
      type: 'array',
      defaultValue: [10, 5, 15, 2, 7, 12, 20],
      placeholder: '10, 5, 15, 2, 7, 12, 20',
      help: 'Values are interpreted as level-order (top to bottom, left to right).',
      randomize: () => randomLevelTree(7, 1, 99),
      presets: [
        { label: 'Balanced', values: [50, 30, 70, 20, 40, 60, 80] },
        { label: 'Small', values: [10, 5, 15, 2, 7] },
        { label: 'Unbalanced', values: [50, 40, 30, 20, 10] },
      ],
    },
  ],
  operations: [
    { id: 'build', label: 'Build Tree', variant: 'gold', ariaLabel: 'Build the binary tree' },
    { id: 'preorder', label: 'Preorder', variant: 'navy', ariaLabel: 'Run preorder traversal' },
    { id: 'inorder', label: 'Inorder', variant: 'navy', ariaLabel: 'Run inorder traversal' },
    { id: 'postorder', label: 'Postorder', variant: 'navy', ariaLabel: 'Run postorder traversal' },
    { id: 'level', label: 'Level Order', variant: 'navy', ariaLabel: 'Run level order traversal' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the tree' },
  ],
  disabled: () => ({}),
  validate(values) {
    const parsed = parseLevelOrder(values.values);
    return validateLevelOrder(values.values, parsed);
  },
  Component: Renderer,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = baseTreeState(experiment, 'binary-tree');
    void algorithm;

    if (opId === 'build') {
      const parsed = parseLevelOrder(values.values);
      const validation = validateLevelOrder(values.values, parsed);
      if (!validation.ok) {
        setErrors(validation.errors);
        setStatus({
          kind: 'error',
          title: 'Please fix the input before building.',
          detail: Object.values(validation.errors)[0] ?? 'Check the highlighted fields.',
        });
        return;
      }
      setErrors({});
      const root = buildLevelOrder(parsed.values);
      const steps = generateTraversalSteps(root, 'level');
      setExperiment({
        ...state,
        values: parsed.values,
        steps,
        traversalType: 'level',
        lastOp: 'build',
        history: pushTreeHistory(state, `Built tree (${parsed.values.join(', ')})`),
        lastMessage: `Built tree with root ${parsed.values[0]}.`,
        meta: { action: 'build' },
        runId: freshRunId(),
      });
      setStatus({
        kind: 'success',
        title: 'Tree built.',
        detail: `Root ${parsed.values[0]} · ${parsed.values.length} nodes · values read as level-order.`,
      });
      return;
    }

    if (TRAVERSAL_OPS.includes(opId)) {
      const parsed = parseLevelOrder(values.values);
      const activeValues = state.values.length > 0 ? state.values : parsed.values;
      if (!parsed.ok && state.values.length === 0) {
        setErrors(validateLevelOrder(values.values, parsed).errors);
        setStatus({
          kind: 'error',
          title: 'Please fix the input before traversing.',
          detail: 'Enter level-order values or press Build Tree first.',
        });
        return;
      }
      setErrors({});
      const next = { ...state, values: activeValues };
      runTraversal(next, opId, setExperiment, setStatus);
      return;
    }

    if (opId === 'clear') {
      const previous = state.values;
      const message =
        previous.length === 0
          ? 'Clear — the tree was already empty'
          : `Cleared the tree (removed ${previous.length} nodes)`;
      setExperiment({
        ...state,
        values: [],
        steps: null,
        traversalType: null,
        history: pushTreeHistory(state, message),
        lastMessage: 'Cleared the tree.',
        meta: { action: 'clear' },
        runId: freshRunId(),
      });
      setStatus({ kind: 'success', title: 'Cleared.', detail: 'The tree is now empty.' });
      return;
    }

    if (opId === 'undo') {
      const restored = undoTreeState(state);
      if (!restored) {
        setStatus({
          kind: 'idle',
          title: 'Nothing to undo.',
          detail: 'The tree is already at its starting state.',
        });
        return;
      }
      setErrors({});
      setExperiment(restored);
      setStatus({ kind: 'idle', title: 'Undid last operation.', detail: restored.lastMessage });
    }
  },
  onReset(_values, { setErrors, setStatus, setExperiment }) {
    setErrors({});
    setExperiment(null);
    setStatus({
      kind: 'idle',
      title: 'Ready to experiment.',
      detail: 'Enter level-order values, then press Build Tree.',
    });
  },
};

export default binaryTree;
