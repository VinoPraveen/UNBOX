import createTreePlaygroundRenderer from '../TreePlayground.jsx';
import { buildBST } from '../../dataStructures/bst.js';
import {
  generateDeleteSteps,
  generateInsertSteps,
  generateSearchSteps,
} from '../../algorithms/trees/bstSteps.js';
import { generateTraversalSteps } from '../../algorithms/trees/traversals.js';
import {
  HEIGHT_NOTE,
  baseTreeState,
  parseNumber,
  pushTreeHistory,
  randomBSTValues,
  undoTreeState,
} from '../treeShared.js';

const SLUG = 'binary-search-tree';
const Renderer = createTreePlaygroundRenderer({
  vizSlug: SLUG,
  title: 'Binary Search Tree',
  complexity: {
    operations: [
      { label: 'Average Search', value: 'O(log n)' },
      { label: 'Average Insert', value: 'O(log n)' },
      { label: 'Average Delete', value: 'O(log n)' },
      { label: 'Worst-case Search', value: 'O(n)' },
      { label: 'Worst-case Insert', value: 'O(n)' },
      { label: 'Worst-case Delete', value: 'O(n)' },
    ],
  },
  heightNote: HEIGHT_NOTE,
});

function freshRunId() {
  return `bst-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const TRAVERSAL_OPS = ['preorder', 'inorder', 'postorder', 'level'];

const bst = {
  slug: SLUG,
  title: 'Binary Search Tree',
  description:
    'Insert, search, and delete with the BST rule LEFT < ROOT < RIGHT. Duplicate values are not inserted.',
  experience: 'full',
  conceptSlug: 'binary-search-tree',
  algorithmSlug: SLUG,
  persistent: true,
  inputs: [
    {
      id: 'value',
      label: 'Value',
      type: 'number',
      placeholder: '42',
      help: 'Used by Insert, Search, and Delete. Duplicate values are not inserted.',
    },
    {
      id: 'bulk',
      label: 'Bulk values (optional)',
      type: 'array',
      defaultValue: [],
      placeholder: '50, 30, 70, 20, 40, 60, 80',
      help: 'Comma-separated numbers inserted in order using BST insertion. Used by Build.',
      randomize: () => randomBSTValues(7, 1, 99),
      presets: [
        { label: 'Balanced', values: [50, 30, 70, 20, 40, 60, 80] },
        { label: 'Unbalanced', values: [50, 40, 30, 20, 10] },
        { label: 'Small', values: [10, 5, 15, 2, 7] },
      ],
    },
  ],
  operations: [
    { id: 'build', label: 'Build', variant: 'gold', ariaLabel: 'Build the BST from bulk values' },
    { id: 'insert', label: 'Insert', variant: 'gold', ariaLabel: 'Insert a value into the BST' },
    { id: 'search', label: 'Search', variant: 'navy', ariaLabel: 'Search the BST for a value' },
    { id: 'delete', label: 'Delete', variant: 'navy', ariaLabel: 'Delete a value from the BST' },
    { id: 'preorder', label: 'Preorder', variant: 'ghost', ariaLabel: 'Run preorder traversal' },
    { id: 'inorder', label: 'Inorder', variant: 'ghost', ariaLabel: 'Run inorder traversal' },
    { id: 'postorder', label: 'Postorder', variant: 'ghost', ariaLabel: 'Run postorder traversal' },
    { id: 'level', label: 'Level Order', variant: 'ghost', ariaLabel: 'Run level order traversal' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the BST' },
  ],
  disabled: () => ({}),
  validate() {
    return { ok: true, errors: {} };
  },
  Component: Renderer,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = baseTreeState(experiment, 'bst');
    const currentRoot = () => buildBST(state.values);

    if (opId === 'build') {
      const raw = String(values.bulk ?? '').trim();
      if (raw === '') {
        setErrors({ bulk: 'Enter bulk values or insert one value at a time.' });
        setStatus({
          kind: 'error',
          title: 'Please enter bulk values.',
          detail: 'Type comma-separated numbers, e.g. 50, 30, 70, 20, 40, 60, 80.',
        });
        return;
      }
      const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
      const nums = parts.map(Number);
      if (!nums.every(Number.isFinite)) {
        setErrors({ bulk: 'Please enter only valid numbers.' });
        setStatus({
          kind: 'error',
          title: 'Invalid bulk values.',
          detail: 'Bulk values must be comma-separated numbers.',
        });
        return;
      }
      setErrors({});
      const deduped = [];
      for (const n of nums) if (!deduped.includes(n)) deduped.push(n);
      const root = buildBST(deduped);
      const steps = generateTraversalSteps(root, 'inorder');
      setExperiment({
        ...state,
        values: deduped,
        steps,
        traversalType: 'inorder',
        lastOp: 'build',
        history: pushTreeHistory(state, `Built BST (${deduped.join(', ')})`),
        lastMessage: `Built BST with ${deduped.length} nodes.`,
        meta: { action: 'build' },
        runId: freshRunId(),
      });
      setStatus({
        kind: 'success',
        title: 'BST built.',
        detail: `Inserted ${deduped.length} values with BST insertion. Inorder yields sorted values.`,
      });
      return;
    }

    if (opId === 'insert') {
      const parsed = parseNumber(values.value);
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before pressing Insert.',
        });
        return;
      }
      setErrors({});
      const { steps, root, inserted, duplicate } = generateInsertSteps(
        currentRoot(),
        parsed.value
      );
      const nextValues = inserted ? [...state.values, parsed.value] : state.values;
      setExperiment({
        ...state,
        values: nextValues,
        steps,
        lastOp: 'insert',
        history: inserted ? pushTreeHistory(state, `Inserted ${parsed.value}`) : state.history,
        lastMessage: duplicate
          ? `${parsed.value} already exists — duplicates are not inserted.`
          : `Inserted ${parsed.value}.`,
        meta: { action: 'insert', value: parsed.value },
        runId: freshRunId(),
      });
      void root;
      setStatus(
        duplicate
          ? {
              kind: 'error',
              title: 'Duplicate value.',
              detail: `${parsed.value} already exists. Duplicate values are not inserted.`,
            }
          : {
              kind: 'success',
              title: 'Inserted.',
              detail: `${parsed.value} placed with BST rule LEFT < ROOT < RIGHT.`,
            }
      );
      return;
    }

    if (opId === 'search') {
      const parsed = parseNumber(values.value);
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before pressing Search.',
        });
        return;
      }
      if (state.values.length === 0) {
        setStatus({
          kind: 'error',
          title: 'The tree is empty.',
          detail: 'Insert values first, then search.',
        });
        return;
      }
      setErrors({});
      const { steps, found, path } = generateSearchSteps(currentRoot(), parsed.value);
      setExperiment({
        ...state,
        steps,
        lastOp: 'search',
        lastMessage: found ? `Found ${parsed.value}.` : `${parsed.value} not found.`,
        meta: { action: 'search', value: parsed.value },
        runId: freshRunId(),
      });
      setStatus(
        found
          ? {
              kind: 'success',
              title: 'Found.',
              detail: `Search path: ${path.join(' → ')} (${path.length} checks).`,
            }
          : {
              kind: 'notice',
              title: 'Target not found.',
              detail: `Search path: ${path.join(' → ')} → null.`,
            }
      );
      return;
    }

    if (opId === 'delete') {
      const parsed = parseNumber(values.value);
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before pressing Delete.',
        });
        return;
      }
      if (state.values.length === 0) {
        setStatus({
          kind: 'error',
          title: 'The tree is empty.',
          detail: 'There is nothing to delete.',
        });
        return;
      }
      setErrors({});
      const { steps, root, changed, case: deleteCase } = generateDeleteSteps(
        currentRoot(),
        parsed.value
      );
      void root;
      if (!changed) {
        setExperiment({
          ...state,
          steps,
          lastOp: 'delete',
          lastMessage: `${parsed.value} not found.`,
          meta: { action: 'delete', value: parsed.value },
          runId: freshRunId(),
        });
        setStatus({
          kind: 'error',
          title: 'Value not found.',
          detail: `${parsed.value} is not in the tree. Nothing deleted.`,
        });
        return;
      }
      const remaining = state.values.filter((v) => v !== parsed.value);
      setExperiment({
        ...state,
        values: remaining,
        steps,
        lastOp: 'delete',
        history: pushTreeHistory(state, `Deleted ${parsed.value}`),
        lastMessage: `Deleted ${parsed.value} (${deleteCase}).`,
        meta: { action: 'delete', value: parsed.value },
        runId: freshRunId(),
      });
      setStatus({
        kind: 'success',
        title: 'Deleted.',
        detail: `${parsed.value} removed (${deleteCase}). The tree remains a valid BST.`,
      });
      return;
    }

    if (TRAVERSAL_OPS.includes(opId)) {
      if (state.values.length === 0) {
        setStatus({
          kind: 'error',
          title: 'The tree is empty.',
          detail: 'Insert values first, then run a traversal.',
        });
        return;
      }
      setErrors({});
      const steps = generateTraversalSteps(currentRoot(), opId);
      const order = steps.length > 0 ? (steps[steps.length - 1].result ?? []) : [];
      setExperiment({
        ...state,
        steps,
        traversalType: opId,
        lastOp: opId,
        lastMessage: `${steps[steps.length - 1]?.heading ?? 'Traversal complete.'}`,
        meta: { action: opId },
        runId: freshRunId(),
      });
      const sortedNote =
        opId === 'inorder' ? ' Inorder of a BST yields sorted values.' : '';
      setStatus({
        kind: 'success',
        title: 'Traversal complete.',
        detail: `${order.join(' → ')}.${sortedNote}`,
      });
      return;
    }

    if (opId === 'clear') {
      const previous = state.values;
      const message =
        previous.length === 0
          ? 'Clear — the tree was already empty'
          : `Cleared the BST (removed ${previous.length} nodes)`;
      setExperiment({
        ...state,
        values: [],
        steps: null,
        traversalType: null,
        history: pushTreeHistory(state, message),
        lastMessage: 'Cleared the BST.',
        meta: { action: 'clear' },
        runId: freshRunId(),
      });
      setStatus({ kind: 'success', title: 'Cleared.', detail: 'The BST is now empty.' });
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
      detail: 'Insert values or build from bulk values, then run an operation.',
    });
  },
};

export default bst;
