import createGraphPlaygroundRenderer from '../GraphPlayground.jsx';
import { createGraph } from '../../dataStructures/graph.js';
import {
  GRAPH_PRESETS,
  addEdge,
  addNode,
  applyPreset,
  baseGraphState,
  freshRunId,
  parseLabel,
  pushGraphHistory,
  randomGraph,
  removeEdge,
  removeNode,
  singleGraphStep,
  undoGraphState,
} from '../graphShared.js';

const SLUG = 'graph-basics';
const Renderer = createGraphPlaygroundRenderer({
  vizSlug: SLUG,
  title: 'Graph Basics',
  complexity: {
    operations: [
      { label: 'Add node / edge', value: 'O(1)' },
      { label: 'Remove node / edge', value: 'O(V + E)' },
      { label: 'Neighbors', value: 'O(V + E)' },
      { label: 'Space (adjacency list)', value: 'O(V + E)' },
    ],
  },
  orderNote: 'Neighbors are listed in alphabetical order.',
  autoPlay: false,
});

function describe(graph) {
  const mode = graph.directed ? 'Directed' : 'Undirected';
  return `${mode} · ${graph.nodes.length} node${graph.nodes.length === 1 ? '' : 's'} · ${graph.edges.length} edge${graph.edges.length === 1 ? '' : 's'}`;
}

function refresh(state, setExperiment, message, detail) {
  setExperiment({
    ...state,
    steps: singleGraphStep(state.graph, {
      status: `${describe(state.graph)} — ${message}`,
      heading: message,
      detail,
    }),
    lastOp: 'edit',
    lastMessage: message,
    meta: { action: 'edit' },
    runId: freshRunId('gb'),
  });
}

const basics = {
  slug: SLUG,
  title: 'Graph Basics',
  description:
    'Build a graph node by node. Learn VERTEX, EDGE, directed vs undirected, and optional weights.',
  experience: 'full',
  conceptSlug: 'graph-basics',
  algorithmSlug: SLUG,
  persistent: true,
  inputs: [
    {
      id: 'node',
      label: 'Node label',
      type: 'text',
      placeholder: 'A',
      help: 'A short label, e.g. A, B, C.',
    },
    {
      id: 'from',
      label: 'Edge from',
      type: 'text',
      placeholder: 'A',
      help: 'Start endpoint of the edge.',
    },
    {
      id: 'to',
      label: 'Edge to',
      type: 'text',
      placeholder: 'B',
      help: 'End endpoint of the edge.',
    },
    {
      id: 'weight',
      label: 'Weight (optional)',
      type: 'number',
      placeholder: '5',
      help: 'Leave blank for an unweighted edge.',
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
  ],
  operations: [
    { id: 'add-node', label: 'Add Node', variant: 'gold', ariaLabel: 'Add a node to the graph' },
    { id: 'add-edge', label: 'Add Edge', variant: 'gold', ariaLabel: 'Add an edge to the graph' },
    { id: 'remove-node', label: 'Remove Node', variant: 'navy', ariaLabel: 'Remove a node from the graph' },
    { id: 'remove-edge', label: 'Remove Edge', variant: 'navy', ariaLabel: 'Remove an edge from the graph' },
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
    const state = baseGraphState(experiment, 'basics');

    if (opId === 'add-node') {
      const parsed = parseLabel(values.node);
      if (!parsed.ok) {
        setErrors({ node: 'Please enter a node label.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a node label.',
          detail: 'Type a short label such as A before pressing Add Node.',
        });
        return;
      }
      const result = addNode(state.graph, parsed.id);
      if (!result.ok) {
        setErrors({ node: `${parsed.id} already exists.` });
        setStatus({
          kind: 'error',
          title: 'Duplicate node.',
          detail: `A vertex called ${parsed.id} is already in the graph.`,
        });
        return;
      }
      setErrors({});
      const next = { ...state, graph: result.graph, history: pushGraphHistory(state, `Added node ${parsed.id}`) };
      refresh(next, setExperiment, `Added vertex ${parsed.id}.`, `A vertex (node) holds one label. ${parsed.id} is now part of the graph — connect it with Add Edge.`);
      setStatus({ kind: 'success', title: 'Node added.', detail: `Vertex ${parsed.id} is on the canvas. Drag it anywhere — edges stay connected.` });
      return;
    }

    if (opId === 'add-edge') {
      const from = parseLabel(values.from);
      const to = parseLabel(values.to);
      if (!from.ok || !to.ok) {
        setErrors({ ...(from.ok ? {} : { from: 'Enter a start node.' }), ...(to.ok ? {} : { to: 'Enter an end node.' }) });
        setStatus({
          kind: 'error',
          title: 'Please enter both endpoints.',
          detail: 'Fill Edge from and Edge to with existing node labels.',
        });
        return;
      }
      const result = addEdge(state.graph, from.id, to.id, values.weight);
      if (!result.ok) {
        const messages = {
          'unknown-node': `Both endpoints must exist. ${from.id} or ${to.id} is not in the graph.`,
          'self-loop': 'Self-loops are not supported — pick two different nodes.',
          duplicate: `That edge already exists between ${from.id} and ${to.id}.`,
          'bad-weight': 'Weight must be a number, or leave it blank.',
        };
        setErrors({ to: messages[result.reason] ?? 'Cannot add this edge.' });
        setStatus({ kind: 'error', title: 'Cannot add edge.', detail: messages[result.reason] ?? 'Check the endpoints and try again.' });
        return;
      }
      setErrors({});
      const weightNote = result.edge.weight !== null ? ` with weight ${result.edge.weight}` : '';
      const arrow = state.graph.directed ? '→' : '—';
      const next = { ...state, graph: result.graph, history: pushGraphHistory(state, `Added edge ${from.id} ${arrow} ${to.id}${weightNote}`) };
      refresh(
        next,
        setExperiment,
        `Added edge ${from.id} ${arrow} ${to.id}${weightNote}.`,
        state.graph.directed
          ? `A directed edge points one way: ${from.id} ──→ ${to.id}. Only ${from.id} lists ${to.id} as a neighbor.`
          : `An undirected edge is a two-way relationship: ${from.id} ── ${to.id}. Each lists the other as a neighbor.`
      );
      setStatus({ kind: 'success', title: 'Edge added.', detail: `${from.id} and ${to.id} are now connected${weightNote}.` });
      return;
    }

    if (opId === 'remove-node') {
      const parsed = parseLabel(values.node);
      if (!parsed.ok) {
        setErrors({ node: 'Please enter a node label.' });
        setStatus({ kind: 'error', title: 'Please enter a node label.', detail: 'Type the label of the node to remove.' });
        return;
      }
      const result = removeNode(state.graph, parsed.id);
      if (!result.ok) {
        setStatus({ kind: 'error', title: 'Node not found.', detail: `There is no vertex called ${parsed.id}.` });
        return;
      }
      setErrors({});
      const next = { ...state, graph: result.graph, history: pushGraphHistory(state, `Removed node ${parsed.id}`) };
      refresh(next, setExperiment, `Removed vertex ${parsed.id}.`, 'Removing a vertex also removes every edge touching it.');
      setStatus({ kind: 'success', title: 'Node removed.', detail: `Vertex ${parsed.id} and its edges are gone.` });
      return;
    }

    if (opId === 'remove-edge') {
      const from = parseLabel(values.from);
      const to = parseLabel(values.to);
      if (!from.ok || !to.ok) {
        setStatus({ kind: 'error', title: 'Please enter both endpoints.', detail: 'Fill Edge from and Edge to.' });
        return;
      }
      const result = removeEdge(state.graph, from.id, to.id);
      if (!result.ok) {
        setStatus({ kind: 'error', title: 'Edge not found.', detail: `There is no edge between ${from.id} and ${to.id}.` });
        return;
      }
      setErrors({});
      const next = { ...state, graph: result.graph, history: pushGraphHistory(state, `Removed edge ${from.id} — ${to.id}`) };
      refresh(next, setExperiment, `Removed the edge between ${from.id} and ${to.id}.`, 'The vertices stay — only their connection is gone.');
      setStatus({ kind: 'success', title: 'Edge removed.', detail: `${from.id} and ${to.id} are no longer adjacent.` });
      return;
    }

    if (opId === 'toggle-directed') {
      const next = {
        ...state,
        graph: { ...state.graph, directed: !state.graph.directed },
        history: pushGraphHistory(state, `Switched to ${!state.graph.directed ? 'directed' : 'undirected'}`),
      };
      refresh(
        next,
        setExperiment,
        next.graph.directed ? 'Directed graph.' : 'Undirected graph.',
        next.graph.directed
          ? 'Edges have a direction: A ──→ B means A reaches B, but not the other way.'
          : 'Edges represent a two-way relationship: A ── B means each reaches the other.'
      );
      setStatus({ kind: 'success', title: next.graph.directed ? 'Directed.' : 'Undirected.', detail: 'Existing edges were reinterpreted under the new mode.' });
      return;
    }

    if (opId === 'load-example') {
      const index = Number(values.example ?? 1);
      const { preset, graph } = applyPreset(Number.isFinite(index) ? index : 1, state.graph.directed);
      setErrors({});
      const next = { ...state, graph, history: pushGraphHistory(state, `Loaded ${preset.label} example`) };
      refresh(next, setExperiment, `Loaded the ${preset.label} example.`, `Nodes ${preset.nodes.join(', ')} with edges ${preset.edgePairs.map(([a, b]) => `${a}-${b}`).join(', ')}. Generated through the real graph model.`);
      setStatus({ kind: 'success', title: 'Example loaded.', detail: `${preset.label}: ${preset.nodes.length} nodes, ${preset.edgePairs.length} edges.` });
      return;
    }

    if (opId === 'random') {
      const graph = randomGraph({ directed: state.graph.directed, nodeCount: 6, edgeCount: 7 });
      setErrors({});
      const next = { ...state, graph, history: pushGraphHistory(state, 'Generated a random graph') };
      refresh(next, setExperiment, 'Generated a random graph.', 'A connected random graph: no duplicate edges, no self-loops, every node reachable.');
      setStatus({ kind: 'success', title: 'Random graph.', detail: `${graph.nodes.length} nodes, ${graph.edges.length} edges — connected and readable.` });
      return;
    }

    if (opId === 'clear') {
      const previous = state.graph;
      const message =
        previous.nodes.length === 0
          ? 'Clear — the graph was already empty'
          : `Cleared the graph (removed ${previous.nodes.length} nodes)`;
      const next = {
        ...state,
        graph: createGraph({ directed: previous.directed }),
        history: pushGraphHistory(state, message),
      };
      setExperiment({
        ...next,
        steps: null,
        lastOp: null,
        lastMessage: 'Cleared the graph.',
        meta: { action: 'clear' },
        runId: freshRunId('gb'),
      });
      setStatus({ kind: 'success', title: 'Cleared.', detail: 'The graph is now empty.' });
      return;
    }

    if (opId === 'undo') {
      const restored = undoGraphState(state);
      if (!restored) {
        setStatus({ kind: 'idle', title: 'Nothing to undo.', detail: 'The graph is already at its starting state.' });
        return;
      }
      setErrors({});
      if (restored.graph.nodes.length === 0) {
        setExperiment({ ...restored, steps: null });
      } else {
        setExperiment({
          ...restored,
          steps: singleGraphStep(restored.graph, {
            status: `${describe(restored.graph)} — undid last operation.`,
            heading: 'Undid last operation.',
            detail: restored.lastMessage,
          }),
        });
      }
      setStatus({ kind: 'idle', title: 'Undid last operation.', detail: restored.lastMessage });
    }
  },
  onReset(_values, { setErrors, setStatus, setExperiment }) {
    setErrors({});
    setExperiment(null);
    setStatus({
      kind: 'idle',
      title: 'Ready to experiment.',
      detail: 'Add nodes and edges, then watch the graph take shape.',
    });
  },
};

export default basics;
