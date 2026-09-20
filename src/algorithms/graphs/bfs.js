import { cloneGraph, neighbors } from '../../dataStructures/graph.js';
import { graphStats, layoutGraph, makeStep, resetStepKeys } from './graphSteps.js';

// Breadth-First Search with an explicit QUEUE (educationally important).
// Neighbor order is deterministic: alphabetical.
export function generateBfsSteps(graph, start, target = null) {
  resetStepKeys();
  const model = cloneGraph(graph);
  const layout = layoutGraph(model);
  const steps = [];
  const directed = model.directed;
  const wanted = target ? String(target).trim().toUpperCase() : null;

  const push = (fields) => steps.push(makeStep({ target: wanted, ...fields }));

  if (model.nodes.length === 0) {
    push({
      ...base(model, layout),
      complete: true,
      phase: 'empty',
      stats: graphStats(model, { visited: 0, edgesExamined: 0 }),
      status: 'The graph is empty — add nodes first.',
      heading: 'Empty graph.',
      detail: 'Add nodes and edges, then run BFS from a start node.',
    });
    return { steps, order: [], found: false, path: [] };
  }

  if (!model.nodes.includes(start)) {
    push({
      ...base(model, layout),
      complete: true,
      phase: 'empty',
      stats: graphStats(model, { visited: 0, edgesExamined: 0 }),
      status: `Start node ${start} is not in the graph.`,
      heading: 'Unknown start node.',
      detail: `Add a node called ${start} first, or pick a start node that exists.`,
    });
    return { steps, order: [], found: false, path: [] };
  }

  const visited = new Set();
  const parent = {};
  const queue = [];
  const order = [];
  let edgesExamined = 0;

  const nodeStates = { [start]: 'start' };
  push({
    ...base(model, layout),
    nodeStates: { ...nodeStates },
    queue: [],
    panelKind: 'queue',
    complete: false,
    phase: 'start',
    stats: graphStats(model, { visited: 0, edgesExamined: 0 }),
    status: `Start BFS from ${start}.`,
    heading: `Start BFS from ${start}.`,
    detail: `Breadth-first search uses a QUEUE and explores level by level. Neighbors are visited in alphabetical order.${wanted ? ` Searching for target ${wanted}.` : ''}`,
  });

  queue.push(start);
  visited.add(start);
  push({
    ...base(model, layout),
    nodeStates: { [start]: 'queued' },
    queue: [...queue],
    panelKind: 'queue',
    complete: false,
    phase: 'enqueue',
    stats: graphStats(model, { visited: 0, edgesExamined: 0 }),
    status: `Add ${start} to the queue.`,
    heading: `Add ${start} to the queue.`,
    detail: 'The start node is queued. The queue always holds the nodes waiting to be visited.',
  });

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    if (wanted && current === wanted) {
      const path = buildPath(parent, start, wanted);
      push({
        ...base(model, layout),
        nodeStates: withStates(order, { [current]: 'found', [start]: 'start' }),
        queue: [...queue],
        panelKind: 'queue',
        result: [...order],
        path,
        complete: true,
        phase: 'found',
        stats: graphStats(model, {
          visited: order.length,
          edgesExamined,
          found: true,
          pathLength: path.length,
        }),
        status: `✓ Found ${wanted} — path ${path.join(' → ')}.`,
        heading: `Found ${wanted}.`,
        detail: `Search path: ${path.join(' → ')}. BFS stops as soon as the target is removed from the queue. Visited ${order.length} nodes and examined ${edgesExamined} edges.`,
      });
      return { steps, order, found: true, path };
    }

    push({
      ...base(model, layout),
      nodeStates: withStates(order, { [current]: 'current', [start]: 'start' }),
      queue: [...queue],
      panelKind: 'queue',
      result: [...order],
      complete: false,
      phase: 'visit',
      stats: graphStats(model, { visited: order.length, edgesExamined }),
      status: `Remove ${current} from the front of the queue and visit it.`,
      heading: `Visit ${current}.`,
      detail: `Remove ${current} from the FRONT of the queue (first in, first out).${queue.length > 0 ? ` Queue is now [${queue.join(', ')}].` : ' The queue is now empty.'}`,
    });

    const fresh = [];
    for (const { node } of neighbors(model, current)) {
      edgesExamined += 1;
      if (!visited.has(node)) {
        visited.add(node);
        parent[node] = current;
        queue.push(node);
        fresh.push(node);
      }
    }

    if (fresh.length > 0) {
      const states = withStates(order, { [start]: 'start' });
      for (const n of queue) if (!states[n]) states[n] = 'queued';
      push({
        ...base(model, layout),
        nodeStates: states,
        edgeStates: activeEdges(model, current, fresh, directed),
        queue: [...queue],
        panelKind: 'queue',
        result: [...order],
        complete: false,
        phase: 'neighbors',
        stats: graphStats(model, { visited: order.length, edgesExamined }),
        status: `Add unvisited neighbor${fresh.length === 1 ? '' : 's'} ${fresh.join(', ')} to the queue.`,
        heading: `Discover ${fresh.join(', ')}.`,
        detail: `From ${current}, unvisited neighbors ${fresh.join(', ')} join the BACK of the queue. Already-visited neighbors are skipped — the visited set prevents revisiting and infinite loops.`,
      });
    } else {
      const states = withStates(order, { [start]: 'start' });
      for (const n of queue) if (!states[n]) states[n] = 'queued';
      push({
        ...base(model, layout),
        nodeStates: states,
        queue: [...queue],
        panelKind: 'queue',
        result: [...order],
        complete: false,
        phase: 'neighbors',
        stats: graphStats(model, { visited: order.length, edgesExamined }),
        status: `${current} has no unvisited neighbors.`,
        heading: `No new neighbors from ${current}.`,
        detail: `Every neighbor of ${current} was already visited or queued. Move on to the next node in the queue.`,
      });
    }
  }

  const unvisited = model.nodes.filter((n) => !visited.has(n));
  if (wanted) {
    push({
      ...base(model, layout),
      nodeStates: withStates(order, { [start]: 'start' }),
      queue: [],
      panelKind: 'queue',
      result: [...order],
      complete: true,
      phase: 'miss',
      stats: graphStats(model, { visited: order.length, edgesExamined, found: false }),
      status: `${wanted} was not reached from ${start}.`,
      heading: 'Target not found.',
      detail: `BFS visited ${order.join(' → ')} and the queue emptied without finding ${wanted}.${unvisited.length > 0 ? ` Nodes ${unvisited.join(', ')} are in a disconnected component and were never reached.` : ''}`,
    });
    return { steps, order, found: false, path: [] };
  }

  push({
    ...base(model, layout),
    nodeStates: withStates(order, { [start]: 'start' }),
    queue: [],
    panelKind: 'queue',
    result: [...order],
    complete: true,
    phase: 'done',
    stats: graphStats(model, { visited: order.length, edgesExamined }),
    status: `✓ BFS complete: ${order.join(' → ')}.`,
    heading: 'BFS complete.',
    detail: `Visited ${order.length} nodes level by level and examined ${edgesExamined} edges.${unvisited.length > 0 ? ` The graph contains another disconnected component (${unvisited.join(', ')}), which stays unvisited — BFS from ${start} only reaches its own component.` : ''}`,
  });
  return { steps, order, found: false, path: [] };
}

function base(model, layout) {
  return { model, layout, directed: model.directed };
}

function withStates(order, extra = {}) {
  const states = {};
  for (const n of order) states[n] = 'visited';
  return { ...states, ...extra };
}

function activeEdges(model, current, fresh, directed) {
  const states = {};
  for (const edge of model.edges) {
    const connects =
      (edge.from === current && fresh.includes(edge.to)) ||
      (!directed && edge.to === current && fresh.includes(edge.from));
    if (connects) states[edge.id] = 'active';
  }
  return states;
}

function buildPath(parent, start, target) {
  const path = [target];
  let current = target;
  while (current !== start) {
    current = parent[current];
    if (!current) return [target];
    path.unshift(current);
  }
  return path;
}
