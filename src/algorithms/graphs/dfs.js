import { cloneGraph, neighbors } from '../../dataStructures/graph.js';
import { graphStats, layoutGraph, makeStep, resetStepKeys } from './graphSteps.js';

// Depth-First Search with an explicit STACK (iterative).
// Neighbors are pushed in reverse alphabetical order so the smallest neighbor
// is explored first. Documented in the UI.
export function generateDfsSteps(graph, start, target = null) {
  resetStepKeys();
  const model = cloneGraph(graph);
  const layout = layoutGraph(model);
  const steps = [];
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
      detail: 'Add nodes and edges, then run DFS from a start node.',
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
  const stack = [start];
  const order = [];
  let edgesExamined = 0;

  push({
    ...base(model, layout),
    nodeStates: { [start]: 'start' },
    stack: [...stack],
    panelKind: 'stack',
    complete: false,
    phase: 'start',
    stats: graphStats(model, { visited: 0, edgesExamined: 0 }),
    status: `Start DFS at ${start}.`,
    heading: `Start DFS at ${start}.`,
    detail: `Depth-first search uses a STACK and goes as deep as possible before backtracking. Neighbors are explored in alphabetical order.${wanted ? ` Searching for target ${wanted}.` : ''}`,
  });

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    order.push(current);

    if (wanted && current === wanted) {
      const path = buildPath(parent, start, wanted);
      push({
        ...base(model, layout),
        nodeStates: withStates(order, { [current]: 'found', [start]: 'start' }),
        stack: [...stack],
        panelKind: 'stack',
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
        detail: `Search path: ${path.join(' → ')}. DFS stops as soon as the target is popped from the stack.`,
      });
      return { steps, order, found: true, path };
    }

    push({
      ...base(model, layout),
      nodeStates: withStates(order, { [current]: 'current', [start]: 'start' }),
      stack: [...stack],
      panelKind: 'stack',
      result: [...order],
      complete: false,
      phase: 'visit',
      stats: graphStats(model, { visited: order.length, edgesExamined }),
      status: `Pop ${current} from the top of the stack and explore it.`,
      heading: `Go deep into ${current}.`,
      detail: `Pop ${current} from the TOP of the stack (last in, first out).${stack.length > 0 ? ` Stack is now [${stack.join(', ')}].` : ' The stack is now empty.'}`,
    });

    const fresh = [];
    for (const { node } of neighbors(model, current)) {
      edgesExamined += 1;
      if (!visited.has(node) && !stack.includes(node)) {
        if (parent[node] === undefined) parent[node] = current;
        fresh.push(node);
      }
    }

    if (fresh.length > 0) {
      // Push reversed so the alphabetically-smallest neighbor is on top.
      for (let i = fresh.length - 1; i >= 0; i -= 1) stack.push(fresh[i]);
      const states = withStates(order, { [start]: 'start' });
      for (const n of stack) if (!states[n]) states[n] = 'queued';
      states[fresh[0]] = 'queued';
      push({
        ...base(model, layout),
        nodeStates: states,
        stack: [...stack],
        panelKind: 'stack',
        result: [...order],
        complete: false,
        phase: 'neighbors',
        stats: graphStats(model, { visited: order.length, edgesExamined }),
        status: `Push unvisited neighbor${fresh.length === 1 ? '' : 's'} ${fresh.join(', ')} — next: ${fresh[0]}.`,
        heading: `Move to neighbor ${fresh[0]}.`,
        detail: `From ${current}, push ${fresh.join(', ')} onto the stack. ${fresh[0]} sits on top, so DFS continues deeper from ${fresh[0]} before trying anything else.`,
      });
    } else {
      const states = withStates(order, { [start]: 'start' });
      for (const n of stack) if (!states[n]) states[n] = 'queued';
      const next = stack.length > 0 ? stack[stack.length - 1] : null;
      push({
        ...base(model, layout),
        nodeStates: states,
        stack: [...stack],
        panelKind: 'stack',
        result: [...order],
        complete: false,
        phase: 'backtrack',
        stats: graphStats(model, { visited: order.length, edgesExamined }),
        status: `${current} has no unvisited neighbors — backtrack.`,
        heading: `${current} is a dead end. Backtrack.`,
        detail: next
          ? `${current} is finished. Backtrack to ${next} (top of the stack) and explore from there.`
          : `${current} is finished and the stack is empty — the reachable graph is fully explored.`,
      });
    }
  }

  const unvisited = model.nodes.filter((n) => !visited.has(n));
  if (wanted) {
    push({
      ...base(model, layout),
      nodeStates: withStates(order, { [start]: 'start' }),
      stack: [],
      panelKind: 'stack',
      result: [...order],
      complete: true,
      phase: 'miss',
      stats: graphStats(model, { visited: order.length, edgesExamined, found: false }),
      status: `${wanted} was not reached from ${start}.`,
      heading: 'Target not found.',
      detail: `DFS visited ${order.join(' → ')} and the stack emptied without finding ${wanted}.${unvisited.length > 0 ? ` Nodes ${unvisited.join(', ')} are in a disconnected component.` : ''}`,
    });
    return { steps, order, found: false, path: [] };
  }

  push({
    ...base(model, layout),
    nodeStates: withStates(order, { [start]: 'start' }),
    stack: [],
    panelKind: 'stack',
    result: [...order],
    complete: true,
    phase: 'done',
    stats: graphStats(model, { visited: order.length, edgesExamined }),
    status: `✓ DFS complete: ${order.join(' → ')}.`,
    heading: 'DFS complete.',
    detail: `Visited ${order.length} nodes, always going deep before backtracking, and examined ${edgesExamined} edges.${unvisited.length > 0 ? ` The graph contains another disconnected component (${unvisited.join(', ')}), which stays unvisited — DFS from ${start} only reaches its own component.` : ''}`,
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
