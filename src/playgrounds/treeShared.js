import { parseNumber, withHistory } from './dataStructureShared.js';

export const HEIGHT_NOTE =
  'Height counts levels: an empty tree has height 0 and a single node has height 1.';

export function parseLevelOrder(raw, maxNodes = 31) {
  const text = raw === undefined || raw === null ? '' : String(raw);
  const parts = text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part !== '');
  if (parts.length === 0) return { ok: false, reason: 'empty' };
  if (parts.length > maxNodes) return { ok: false, reason: 'too-many', count: parts.length };
  const values = [];
  for (const part of parts) {
    const number = Number(part);
    if (!Number.isFinite(number)) return { ok: false, reason: 'invalid' };
    values.push(number);
  }
  return { ok: true, values };
}

export function validateLevelOrder(values, parsed) {
  const errors = {};
  if (!parsed.ok) {
    if (parsed.reason === 'empty') errors.values = 'Please enter at least one number.';
    else if (parsed.reason === 'invalid') errors.values = 'Please enter only valid numbers.';
    else if (parsed.reason === 'too-many')
      errors.values = `Please enter at most 31 numbers for the best view (got ${parsed.count}).`;
    else errors.values = 'Please enter a valid level-order list.';
    return { ok: false, errors };
  }
  void values;
  return { ok: true, errors };
}

export function randomLevelTree(count = 7, min = 1, max = 99) {
  const picked = new Set();
  while (picked.size < count) {
    picked.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...picked];
}

export function randomBSTValues(count = 7, min = 1, max = 99) {
  return randomLevelTree(count, min, max);
}

export function baseTreeState(prev, kind) {
  return {
    values: prev?.values ?? [],
    steps: prev?.steps ?? null,
    traversalType: prev?.traversalType ?? null,
    lastOp: prev?.lastOp ?? null,
    history: prev?.history ?? [],
    lastMessage: prev?.lastMessage ?? '',
    meta: prev?.meta ?? {},
    runId: prev?.runId ?? null,
    kind,
  };
}

export function pushTreeHistory(state, message) {
  return withHistory(state.history, message, state.values);
}

export function undoTreeState(state) {
  const last = state.history[state.history.length - 1];
  if (!last) return null;
  return {
    ...state,
    values: last.items,
    steps: null,
    traversalType: null,
    history: state.history.slice(0, -1),
    lastMessage: `Undid: ${last.message}`,
    meta: { action: 'undo' },
    runId: `tree-${Date.now().toString(36)}`,
  };
}

export { parseNumber };
