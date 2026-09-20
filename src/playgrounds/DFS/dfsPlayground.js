import createGraphPlaygroundRenderer from '../GraphPlayground.jsx';
import { generateDfsSteps } from '../../algorithms/graphs/dfs.js';
import {
  GRAPH_PRESETS,
  baseGraphState,
  freshRunId,
  parseLabel,
  undoGraphState,
} from '../graphShared.js';
import { handleBuilderOp, idleSingleStep } from '../builderOps.js';

const SLUG = 'dfs';
const ORDER_NOTE =
  'Neighbors are explored in alphabetical order using an explicit STACK: last in, first out. Watch for BACKTRACK steps.';
const Renderer = createGraphPlaygroundRenderer({
  vizSlug: SLUG,
  title: 'Depth-First Search',
  complexity: {
    operations: [
      { label: 'Time (adjacency list)', value: 'O(V + E)' },
      { label: 'Space', value: 'O(V)' },
    ],
  },
  orderNote: ORDER_NOTE,
});

const dfs = {
  slug: SLUG,
  title: 'Depth-First Search',
  description:
    'Go deep with a STACK, backtrack at dead ends. Optionally search for a target — DFS stops when it is found.',
  experience: 'full',
  conceptSlug: 'dfs',
  algorithmSlug: SLUG,
  persistent: true,
  inputs: [
    { id: 'node', label: 'Node label', type: 'text', placeholder: 'A', help: 'Add, or remove, this vertex.' },
    { id: 'from', label: 'Edge from', type: 'text', placeholder: 'A', help: 'Start endpoint of the edge.' },
    { id: 'to', label: 'Edge to', type: 'text', placeholder: 'B', help: 'End endpoint of the edge.' },
    {
      id: 'weight',
      label: 'Weight (optional)',
      type: 'number',
      placeholder: '5',
      help: 'DFS ignores weights — they are shown for learning.',
    },
    {
      id: 'example',
      label: 'Example graph',
      type: 'select',
      defaultValue: '1',
      options: GRAPH_PRESETS.map((preset, index) => ({
        value: String(index),
        label: `${preset.label} (${preset.edgePairs.map(([a, b]) => `${a}-${b}`).join(', ')})`,
      })),
      help: 'Pick an example, then press Load Example.',
    },
    { id: 'start', label: 'Start node', type: 'text', placeholder: 'A', help: 'DFS begins here.' },
    { id: 'target', label: 'Target (optional)', type: 'text', placeholder: 'F', help: 'Stop when found. Blank traverses everything reachable.' },
  ],
  operations: [
    { id: 'run', label: 'Run DFS', variant: 'gold', ariaLabel: 'Run depth-first search' },
    { id: 'add-node', label: 'Add Node', variant: 'navy', ariaLabel: 'Add a node to the graph' },
    { id: 'add-edge', label: 'Add Edge', variant: 'navy', ariaLabel: 'Add an edge to the graph' },
    { id: 'remove-node', label: 'Remove Node', variant: 'ghost', ariaLabel: 'Remove a node from the graph' },
    { id: 'remove-edge', label: 'Remove Edge', variant: 'ghost', ariaLabel: 'Remove an edge from the graph' },
    { id: 'toggle-directed', label: 'Toggle Directed', variant: 'ghost', ariaLabel: 'Switch between directed and undirected graph' },
    { id: 'load-example', label: 'Load Example', variant: 'ghost', ariaLabel: 'Load the selected example graph' },
    { id: 'random', label: 'Random', variant: 'ghost', ariaLabel: 'Generate a random graph' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the graph' },
  ],
  disabled: () => ({}),
  validate() {
    return { ok: true, errors: {} };
  },
  Component: Renderer,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = baseGraphState(experiment, 'dfs');
    const refresh = (heading, detail) => {
      setExperiment({
        ...state,
        steps: idleSingleStep(state, heading, detail),
        lastOp: 'edit',
        lastMessage: heading,
        meta: { action: 'edit' },
        runId: freshRunId('dfs'),
      });
    };

    if (opId === 'run') {
      const start = parseLabel(values.start);
      if (!start.ok) {
        setErrors({ start: 'Please enter a start node.' });
        setStatus({ kind: 'error', title: 'Please enter a start node.', detail: 'DFS needs to know where to begin.' });
        return;
      }
      if (state.graph.nodes.length === 0) {
        setStatus({ kind: 'error', title: 'The graph is empty.', detail: 'Add nodes first, or load an example.' });
        return;
      }
      if (!state.graph.nodes.includes(start.id)) {
        setErrors({ start: `${start.id} is not in the graph.` });
        setStatus({ kind: 'error', title: 'Unknown start node.', detail: `Add a vertex called ${start.id} first.` });
        return;
      }
      setErrors({});
      const target = parseLabel(values.target);
      const { steps, order, found, path } = generateDfsSteps(
        state.graph,
        start.id,
        target.ok ? target.id : null
      );
      setExperiment({
        ...state,
        steps,
        lastOp: 'run',
        lastMessage: found ? `Found ${target.id}.` : `DFS complete: ${order.join(' → ')}.`,
        meta: { action: 'run' },
        runId: freshRunId('dfs'),
      });
      if (target.ok) {
        setStatus(
          found
            ? { kind: 'success', title: 'Found.', detail: `Path ${path.join(' → ')} after visiting ${order.length} nodes.` }
            : { kind: 'notice', title: 'Target not found.', detail: `${target.id} was not reached from ${start.id}. Visited ${order.join(' → ')}.` }
        );
      } else {
        setStatus({ kind: 'success', title: 'DFS complete.', detail: `Visit order: ${order.join(' → ')}.` });
      }
      return;
    }

    if (handleBuilderOp(opId, state, values, { setErrors, setStatus, setExperiment }, refresh)) return;

    if (opId === 'undo') {
      const restored = undoGraphState(state);
      if (!restored) {
        setStatus({ kind: 'idle', title: 'Nothing to undo.', detail: 'The graph is already at its starting state.' });
        return;
      }
      setErrors({});
      setExperiment({
        ...restored,
        steps: restored.graph.nodes.length > 0 ? idleSingleStep(restored, 'Undid last operation.', restored.lastMessage) : null,
      });
      setStatus({ kind: 'idle', title: 'Undid last operation.', detail: restored.lastMessage });
    }
  },
  onReset(_values, { setErrors, setStatus, setExperiment }) {
    setErrors({});
    setExperiment(null);
    setStatus({
      kind: 'idle',
      title: 'Ready to experiment.',
      detail: 'Build a graph, set a start node, then press Run DFS.',
    });
  },
};

export default dfs;
