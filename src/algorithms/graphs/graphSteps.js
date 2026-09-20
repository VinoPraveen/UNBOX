import { cloneGraph } from '../../dataStructures/graph.js';

export const VIEW_W = 600;
export const VIEW_H = 420;

// Deterministic circular layout computed from sorted node labels.
// Coordinates are layout-only: the graph model never stores positions.
export function layoutGraph(graph) {
  const sorted = [...graph.nodes].sort();
  const n = sorted.length;
  const cx = VIEW_W / 2;
  const cy = VIEW_H / 2 - 6;
  if (n === 1) return { nodes: [{ id: sorted[0], x: cx, y: cy }], edges: graph.edges };
  const radius = Math.min(245, 78 + n * 22);
  const ry = radius * 0.68;
  const startAngle = -Math.PI / 2;
  const nodes = sorted.map((id, index) => {
    const angle = startAngle + (2 * Math.PI * index) / n;
    return { id, x: cx + radius * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
  return { nodes, edges: graph.edges.map((e) => ({ ...e, directed: graph.directed })) };
}

export function graphStats(graph, extra = {}) {
  return { nodes: graph.nodes.length, edges: graph.edges.length, ...extra };
}

let stepKey = 0;

export function resetStepKeys() {
  stepKey = 0;
}

export function makeStep(fields) {
  stepKey += 1;
  return {
    key: stepKey,
    badge: `Step ${stepKey}`,
    nodeStates: {},
    edgeStates: {},
    queue: null,
    stack: null,
    panelKind: null,
    result: [],
    path: [],
    complete: false,
    ...fields,
  };
}

export function snapshotGraph(graph) {
  return { graph: cloneGraph(graph), layout: layoutGraph(graph) };
}
