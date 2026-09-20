import { createGraph } from '../dataStructures/graph.js';
import {
  addEdge,
  addNode,
  applyPreset,
  parseLabel,
  pushGraphHistory,
  randomGraph,
  removeEdge,
  removeNode,
  singleGraphStep,
} from './graphShared.js';

function describe(graph) {
  const mode = graph.directed ? 'Directed' : 'Undirected';
  return `${mode} · ${graph.nodes.length} nodes · ${graph.edges.length} edges`;
}

// Shared Add/Remove/Clear/Example/Random/Toggle ops for the BFS & DFS
// playgrounds. Returns true when the op was handled.
export function handleBuilderOp(opId, state, values, { setErrors, setStatus, setExperiment }, refresh) {
  if (opId === 'add-node') {
    const parsed = parseLabel(values.node);
    if (!parsed.ok) {
      setErrors({ node: 'Please enter a node label.' });
      setStatus({ kind: 'error', title: 'Please enter a node label.', detail: 'Type a short label such as A.' });
      return true;
    }
    const result = addNode(state.graph, parsed.id);
    if (!result.ok) {
      setErrors({ node: `${parsed.id} already exists.` });
      setStatus({ kind: 'error', title: 'Duplicate node.', detail: `A vertex called ${parsed.id} already exists.` });
      return true;
    }
    setErrors({});
    state.graph = result.graph;
    state.history = pushGraphHistory(state, `Added node ${parsed.id}`);
    refresh(`Added vertex ${parsed.id}.`, `${describe(state.graph)}. Press Run to traverse from a start node.`);
    setStatus({ kind: 'success', title: 'Node added.', detail: `Vertex ${parsed.id} is on the canvas.` });
    return true;
  }

  if (opId === 'add-edge') {
    const from = parseLabel(values.from);
    const to = parseLabel(values.to);
    if (!from.ok || !to.ok) {
      setStatus({ kind: 'error', title: 'Please enter both endpoints.', detail: 'Fill Edge from and Edge to with existing node labels.' });
      return true;
    }
    const result = addEdge(state.graph, from.id, to.id, values.weight);
    if (!result.ok) {
      const messages = {
        'unknown-node': `Both endpoints must exist. ${from.id} or ${to.id} is not in the graph.`,
        'self-loop': 'Self-loops are not supported — pick two different nodes.',
        duplicate: `That edge already exists between ${from.id} and ${to.id}.`,
        'bad-weight': 'Weight must be a number, or leave it blank.',
      };
      setStatus({ kind: 'error', title: 'Cannot add edge.', detail: messages[result.reason] ?? 'Check the endpoints.' });
      return true;
    }
    setErrors({});
    state.graph = result.graph;
    state.history = pushGraphHistory(state, `Added edge ${from.id} — ${to.id}`);
    refresh(`Added edge ${from.id} — ${to.id}.`, `${describe(state.graph)}. Press Run to traverse from a start node.`);
    setStatus({ kind: 'success', title: 'Edge added.', detail: `${from.id} and ${to.id} are now adjacent.` });
    return true;
  }

  if (opId === 'remove-node') {
    const parsed = parseLabel(values.node);
    if (!parsed.ok) {
      setStatus({ kind: 'error', title: 'Please enter a node label.', detail: 'Type the label of the node to remove.' });
      return true;
    }
    const result = removeNode(state.graph, parsed.id);
    if (!result.ok) {
      setStatus({ kind: 'error', title: 'Node not found.', detail: `There is no vertex called ${parsed.id}.` });
      return true;
    }
    setErrors({});
    state.graph = result.graph;
    state.history = pushGraphHistory(state, `Removed node ${parsed.id}`);
    refresh(`Removed vertex ${parsed.id}.`, `${describe(state.graph)}.`);
    setStatus({ kind: 'success', title: 'Node removed.', detail: `Vertex ${parsed.id} and its edges are gone.` });
    return true;
  }

  if (opId === 'remove-edge') {
    const from = parseLabel(values.from);
    const to = parseLabel(values.to);
    if (!from.ok || !to.ok) {
      setStatus({ kind: 'error', title: 'Please enter both endpoints.', detail: 'Fill Edge from and Edge to.' });
      return true;
    }
    const result = removeEdge(state.graph, from.id, to.id);
    if (!result.ok) {
      setStatus({ kind: 'error', title: 'Edge not found.', detail: `There is no edge between ${from.id} and ${to.id}.` });
      return true;
    }
    setErrors({});
    state.graph = result.graph;
    state.history = pushGraphHistory(state, `Removed edge ${from.id} — ${to.id}`);
    refresh(`Removed the edge between ${from.id} and ${to.id}.`, `${describe(state.graph)}.`);
    setStatus({ kind: 'success', title: 'Edge removed.', detail: `${from.id} and ${to.id} are no longer adjacent.` });
    return true;
  }

  if (opId === 'toggle-directed') {
    state.graph = { ...state.graph, directed: !state.graph.directed };
    state.history = pushGraphHistory(state, `Switched to ${state.graph.directed ? 'directed' : 'undirected'}`);
    refresh(
      state.graph.directed ? 'Directed graph.' : 'Undirected graph.',
      state.graph.directed
        ? 'Edges have a direction: A ──→ B means A reaches B, but not the other way.'
        : 'Edges represent a two-way relationship.'
    );
    setStatus({ kind: 'success', title: state.graph.directed ? 'Directed.' : 'Undirected.', detail: 'Existing edges were reinterpreted.' });
    return true;
  }

  if (opId === 'load-example') {
    const index = Number(values.example ?? 1);
    const { preset, graph } = applyPreset(Number.isFinite(index) ? index : 1, state.graph.directed);
    setErrors({});
    state.graph = graph;
    state.history = pushGraphHistory(state, `Loaded ${preset.label} example`);
    refresh(`Loaded the ${preset.label} example.`, `Edges ${preset.edgePairs.map(([a, b]) => `${a}-${b}`).join(', ')}. Set a start node and press Run.`);
    setStatus({ kind: 'success', title: 'Example loaded.', detail: `${preset.label}: ${preset.nodes.length} nodes, ${preset.edgePairs.length} edges.` });
    return true;
  }

  if (opId === 'random') {
    state.graph = randomGraph({ directed: state.graph.directed, nodeCount: 6, edgeCount: 7 });
    setErrors({});
    state.history = pushGraphHistory(state, 'Generated a random graph');
    refresh('Generated a random graph.', 'A connected random graph with no duplicate edges or self-loops.');
    setStatus({ kind: 'success', title: 'Random graph.', detail: `${describe(state.graph)}.` });
    return true;
  }

  if (opId === 'clear') {
    const directed = state.graph.directed;
    const had = state.graph.nodes.length > 0;
    state.history = pushGraphHistory(state, had ? 'Cleared the graph' : 'Clear — the graph was already empty');
    state.graph = createGraph({ directed });
    setExperiment({
      ...state,
      steps: null,
      lastOp: null,
      lastMessage: 'Cleared the graph.',
      meta: { action: 'clear' },
      runId: `${state.kind}-clear-${Date.now().toString(36)}`,
    });
    setStatus({ kind: 'success', title: 'Cleared.', detail: 'The graph is now empty.' });
    return true;
  }

  return false;
}

export function idleSingleStep(state, heading, detail) {
  return singleGraphStep(state.graph, {
    status: `${describe(state.graph)} — ${heading}`,
    heading,
    detail,
  });
}
