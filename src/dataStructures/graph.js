// Real graph representation: adjacency list.
// Nodes are string labels (e.g. "A"). Edges are stored once in `edges` and
// expanded to adjacency on demand. Coordinates are NEVER stored here — layout
// lives in the step generators / visualizer.

export function createGraph({ directed = false } = {}) {
  return { nodes: [], edges: [], directed };
}

export function normalizeLabel(raw) {
  if (raw === undefined || raw === null) return '';
  return String(raw).trim().toUpperCase().slice(0, 8);
}

export function hasNode(graph, label) {
  return graph.nodes.includes(label);
}

export function addNode(graph, label) {
  const id = normalizeLabel(label);
  if (!id) return { ok: false, reason: 'empty' };
  if (hasNode(graph, id)) return { ok: false, reason: 'duplicate', id };
  return {
    ok: true,
    graph: { ...graph, nodes: [...graph.nodes, id] },
    id,
  };
}

export function removeNode(graph, label) {
  const id = normalizeLabel(label);
  if (!hasNode(graph, id)) return { ok: false, reason: 'missing' };
  return {
    ok: true,
    graph: {
      ...graph,
      nodes: graph.nodes.filter((n) => n !== id),
      edges: graph.edges.filter((e) => e.from !== id && e.to !== id),
    },
  };
}

function edgeKey(from, to, directed) {
  return directed ? `${from}->${to}` : [from, to].sort().join('--');
}

export function addEdge(graph, rawFrom, rawTo, weight = null) {
  const from = normalizeLabel(rawFrom);
  const to = normalizeLabel(rawTo);
  if (!from || !to) return { ok: false, reason: 'empty' };
  if (!hasNode(graph, from) || !hasNode(graph, to)) {
    return { ok: false, reason: 'unknown-node', from, to };
  }
  if (from === to) return { ok: false, reason: 'self-loop', from };
  const key = edgeKey(from, to, graph.directed);
  if (graph.edges.some((e) => edgeKey(e.from, e.to, graph.directed) === key)) {
    return { ok: false, reason: 'duplicate', from, to };
  }
  let w = null;
  if (weight !== null && weight !== undefined && String(weight).trim() !== '') {
    const number = Number(weight);
    if (!Number.isFinite(number)) return { ok: false, reason: 'bad-weight' };
    w = number;
  }
  const edge = { id: `e${graph.edges.length}-${key}`, from, to, weight: w };
  return { ok: true, graph: { ...graph, edges: [...graph.edges, edge] }, edge };
}

export function removeEdge(graph, rawFrom, rawTo) {
  const from = normalizeLabel(rawFrom);
  const to = normalizeLabel(rawTo);
  const key = edgeKey(from, to, graph.directed);
  const remaining = graph.edges.filter(
    (e) => edgeKey(e.from, e.to, graph.directed) !== key
  );
  if (remaining.length === graph.edges.length) return { ok: false, reason: 'missing' };
  return { ok: true, graph: { ...graph, edges: remaining } };
}

// Deterministic neighbor ordering: alphabetical. Documented in the UI.
export function neighbors(graph, label) {
  const out = [];
  for (const edge of graph.edges) {
    if (graph.directed) {
      if (edge.from === label) out.push({ node: edge.to, edgeId: edge.id });
    } else if (edge.from === label) {
      out.push({ node: edge.to, edgeId: edge.id });
    } else if (edge.to === label) {
      out.push({ node: edge.from, edgeId: edge.id });
    }
  }
  out.sort((a, b) => (a.node < b.node ? -1 : a.node > b.node ? 1 : 0));
  return out;
}

export function edgeCount(graph) {
  return graph.edges.length;
}

export function cloneGraph(graph) {
  return {
    nodes: [...graph.nodes],
    edges: graph.edges.map((e) => ({ ...e })),
    directed: graph.directed,
  };
}

export function buildGraph({ nodes = [], edgePairs = [], directed = false, weights = {} } = {}) {
  let graph = createGraph({ directed });
  for (const node of nodes) {
    const result = addNode(graph, node);
    if (result.ok) graph = result.graph;
  }
  for (const [from, to] of edgePairs) {
    const key = `${from}-${to}`;
    const result = addEdge(graph, from, to, weights[key] ?? weights[`${to}-${from}`] ?? null);
    if (result.ok) graph = result.graph;
  }
  return graph;
}
