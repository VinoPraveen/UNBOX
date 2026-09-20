import { withHistory } from './dataStructureShared.js';
import { layoutGraph, makeStep, resetStepKeys } from '../algorithms/graphs/graphSteps.js';
import {
  addEdge,
  addNode,
  buildGraph,
  cloneGraph,
  createGraph,
  normalizeLabel,
  removeEdge,
  removeNode,
} from '../dataStructures/graph.js';

export const GRAPH_PRESETS = [
  {
    label: 'Simple',
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edgePairs: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E']],
  },
  {
    label: 'Tree-like',
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edgePairs: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F']],
  },
  {
    label: 'Cycle',
    nodes: ['A', 'B', 'C', 'D'],
    edgePairs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']],
  },
  {
    label: 'Disconnected',
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edgePairs: [['A', 'B'], ['B', 'C'], ['D', 'E']],
  },
];

export function emptyGraphState(directed = false) {
  return createGraph({ directed });
}

export function baseGraphState(prev, kind, directed = false) {
  return {
    graph: prev?.graph ? cloneGraph(prev.graph) : createGraph({ directed }),
    steps: prev?.steps ?? null,
    lastOp: prev?.lastOp ?? null,
    history: prev?.history ?? [],
    lastMessage: prev?.lastMessage ?? '',
    meta: prev?.meta ?? {},
    runId: prev?.runId ?? null,
    kind,
  };
}

export function pushGraphHistory(state, message) {
  return withHistory(state.history, message, cloneGraph(state.graph));
}

export function undoGraphState(state) {
  const last = state.history[state.history.length - 1];
  if (!last) return null;
  return {
    ...state,
    graph: cloneGraph(last.items),
    steps: null,
    lastOp: null,
    history: state.history.slice(0, -1),
    lastMessage: `Undid: ${last.message}`,
    meta: { action: 'undo' },
    runId: freshRunId('graph'),
  };
}

export function freshRunId(prefix = 'graph') {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function parseLabel(raw) {
  const id = normalizeLabel(raw);
  if (!id) return { ok: false };
  return { ok: true, id };
}

export function randomGraph({ directed = false, nodeCount = 6, edgeCount = 7 } = {}) {
  const labels = 'ABCDEFGHIJ'.slice(0, Math.max(2, Math.min(10, nodeCount))).split('');
  let graph = createGraph({ directed });
  for (const label of labels) {
    const result = addNode(graph, label);
    if (result.ok) graph = result.graph;
  }
  const possible = [];
  for (let i = 0; i < labels.length; i += 1) {
    for (let j = 0; j < labels.length; j += 1) {
      if (i === j) continue;
      if (!directed && j < i) continue;
      possible.push([labels[i], labels[j]]);
    }
  }
  // Shuffle, then take edges while keeping every node connected.
  for (let i = possible.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [possible[i], possible[j]] = [possible[j], possible[i]];
  }
  const connected = new Set([labels[0]]);
  const picked = [];
  for (const [from, to] of possible) {
    if (picked.length >= edgeCount) break;
    const touches = connected.has(from) || connected.has(to);
    if (connected.size < labels.length && !touches) continue;
    picked.push([from, to]);
    connected.add(from);
    connected.add(to);
  }
  graph = buildGraph({ nodes: labels, edgePairs: picked, directed });
  return graph;
}

export function applyPreset(index, directed = false) {
  const preset = GRAPH_PRESETS[index] ?? GRAPH_PRESETS[0];
  return {
    preset,
    graph: buildGraph({ nodes: preset.nodes, edgePairs: preset.edgePairs, directed }),
  };
}

// A one-frame "timeline" so Graph Basics reuses the same playback engine.
export function singleGraphStep(graph, { status, heading, detail }) {
  resetStepKeys();
  return [
    makeStep({
      model: cloneGraph(graph),
      layout: layoutGraph(graph),
      directed: graph.directed,
      nodeStates: {},
      edgeStates: {},
      queue: null,
      stack: null,
      panelKind: null,
      result: [],
      path: [],
      complete: false,
      phase: 'idle',
      stats: {
        nodes: graph.nodes.length,
        edges: graph.edges.length,
        visited: 0,
        edgesExamined: 0,
      },
      status,
      heading,
      detail,
    }),
  ];
}

export { addEdge, addNode, buildGraph, cloneGraph, removeEdge, removeNode, normalizeLabel };
