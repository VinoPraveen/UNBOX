import LinkedListPlayground from './LinkedListPlayground.jsx';
import { rebuildLinkedList } from '../../dataStructures/linkedList.js';
import { parseNumber, withHistory } from '../dataStructureShared.js';

function base(prev) {
  return {
    items: prev?.items ?? [],
    history: prev?.history ?? [],
    lastMessage: prev?.lastMessage ?? '',
    meta: prev?.meta ?? {},
    kind: 'linked-list',
  };
}

function parseIndex(raw, maxIndex) {
  const text = raw === undefined || raw === null ? '' : String(raw).trim();
  if (text === '' || !/^\d+$/.test(text)) return { ok: false };
  const index = Number(text);
  if (!Number.isInteger(index) || index < 0 || index > maxIndex) return { ok: false };
  return { ok: true, index };
}

const linkedList = {
  slug: 'linked-list',
  title: 'Linked List',
  description: 'Insert and remove nodes, then search the list. Watch the NEXT references update.',
  experience: 'full',
  conceptSlug: 'linked-list',
  algorithmSlug: 'linked-list',
  persistent: true,
  inputs: [
    {
      id: 'value',
      label: 'Value',
      type: 'number',
      placeholder: '42',
      help: 'The value to insert, delete, or search for.',
    },
    {
      id: 'index',
      label: 'Index',
      type: 'number',
      placeholder: '0',
      help: 'The zero-based position to insert at (used by Insert at Index).',
    },
  ],
  operations: [
    { id: 'insert-beginning', label: 'Insert Beginning', variant: 'gold', ariaLabel: 'Insert a value at the beginning of the list' },
    { id: 'insert-end', label: 'Insert End', variant: 'navy', ariaLabel: 'Insert a value at the end of the list' },
    { id: 'insert-index', label: 'Insert At Index', variant: 'navy', ariaLabel: 'Insert a value at a specific index' },
    { id: 'delete', label: 'Delete Value', variant: 'ghost', ariaLabel: 'Delete the first node with this value' },
    { id: 'search', label: 'Search', variant: 'ghost', ariaLabel: 'Search the list for this value' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the list' },
  ],
  disabled: () => ({}),
  Component: LinkedListPlayground,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = base(experiment);
    const parsed = parseNumber(values.value);

    if (opId === 'insert-beginning' || opId === 'insert-end') {
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before inserting.',
        });
        return;
      }
      setErrors({});
      const list = rebuildLinkedList(state.items);
      if (opId === 'insert-beginning') list.insertAtBeginning(parsed.value);
      else list.insertAtEnd(parsed.value);
      const items = list.toArray();
      const message =
        opId === 'insert-beginning'
          ? `Inserted ${parsed.value} at the beginning`
          : `Inserted ${parsed.value} at the end`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: opId, value: parsed.value },
      });
      setStatus({
        kind: 'success',
        title: 'Inserted.',
        detail:
          opId === 'insert-beginning'
            ? `${parsed.value} is the new head.`
            : `${parsed.value} is the new tail.`,
      });
      return;
    }

    if (opId === 'insert-index') {
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before inserting.',
        });
        return;
      }
      const indexResult = parseIndex(values.index, state.items.length);
      if (!indexResult.ok) {
        setErrors({ index: `Enter a valid index from 0 to ${state.items.length}.` });
        setStatus({
          kind: 'error',
          title: 'Enter a valid index.',
          detail: `Insert At Index accepts a whole number from 0 to ${state.items.length}.`,
        });
        return;
      }
      setErrors({});
      const list = rebuildLinkedList(state.items);
      list.insertAtIndex(parsed.value, indexResult.index);
      const items = list.toArray();
      const message = `Inserted ${parsed.value} at index ${indexResult.index}`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'insert', value: parsed.value, index: indexResult.index },
      });
      setStatus({
        kind: 'success',
        title: 'Inserted.',
        detail: `${parsed.value} now sits at index ${indexResult.index}.`,
      });
      return;
    }

    if (opId === 'delete') {
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before deleting.',
        });
        return;
      }
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'The list is empty.',
          detail: 'There is nothing to delete. Insert a value first.',
        });
        return;
      }
      setErrors({});
      const list = rebuildLinkedList(state.items);
      const result = list.deleteByValue(parsed.value);
      if (!result.ok) {
        setExperiment({
          ...state,
          lastMessage: `${parsed.value} not found`,
          meta: { action: 'delete', value: parsed.value, deleted: false },
        });
        setStatus({
          kind: 'error',
          title: 'Value not found.',
          detail: `No node in the list holds ${parsed.value}.`,
        });
        return;
      }
      const items = list.toArray();
      const message = `Deleted ${parsed.value} (node ${result.index})`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'delete', value: parsed.value, index: result.index },
      });
      setStatus({
        kind: 'success',
        title: 'Deleted.',
        detail: `${parsed.value} was removed from node ${result.index}.`,
      });
      return;
    }

    if (opId === 'search') {
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before searching.',
        });
        return;
      }
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'The list is empty.',
          detail: 'There is nothing to search. Insert a value first.',
        });
        return;
      }
      setErrors({});
      const list = rebuildLinkedList(state.items);
      const result = list.search(parsed.value);
      const trail = result.trail.map((node) => node.index);
      const items = state.items;
      if (result.found) {
        const message = `Found ${parsed.value} at node ${result.index} (${result.comparisons} comparison${result.comparisons === 1 ? '' : 's'})`;
        setExperiment({
          ...state,
          items,
          lastMessage: message,
          meta: {
            action: 'search',
            value: parsed.value,
            found: true,
            index: result.index,
            comparisons: result.comparisons,
            trail,
          },
        });
        setStatus({
          kind: 'success',
          title: 'Found.',
          detail: `${parsed.value} was reached after ${result.comparisons} comparison${result.comparisons === 1 ? '' : 's'}.`,
        });
        return;
      }
      const message = `${parsed.value} not found (searched ${result.comparisons} node${result.comparisons === 1 ? '' : 's'})`;
      setExperiment({
        ...state,
        items,
        lastMessage: message,
        meta: {
          action: 'search',
          value: parsed.value,
          found: false,
          index: -1,
          comparisons: result.comparisons,
          trail,
        },
      });
      setStatus({
        kind: 'notice',
        title: 'Value not found.',
        detail: `The search reached NULL after ${result.comparisons} comparison${result.comparisons === 1 ? '' : 's'}.`,
      });
      return;
    }

    if (opId === 'clear') {
      const previous = state.items;
      const message =
        previous.length === 0
          ? 'Clear \u2014 the list was already empty'
          : `Cleared the list (removed ${previous.length} node${previous.length === 1 ? '' : 's'})`;
      setExperiment({
        ...state,
        items: [],
        history: withHistory(state.history, message, previous),
        lastMessage: 'Cleared the list.',
        meta: { action: 'clear' },
      });
      setStatus({
        kind: 'success',
        title: 'Cleared.',
        detail: 'HEAD now points to NULL.',
      });
      return;
    }

    if (opId === 'undo') {
      const last = state.history[state.history.length - 1];
      if (!last) {
        setStatus({
          kind: 'idle',
          title: 'Nothing to undo.',
          detail: 'The list is already at its starting state.',
        });
        return;
      }
      setErrors({});
      setExperiment({
        ...state,
        items: last.items,
        history: state.history.slice(0, -1),
        lastMessage: `Undid: ${last.message}`,
        meta: { action: 'undo' },
      });
      setStatus({
        kind: 'idle',
        title: 'Undid last operation.',
        detail: last.message,
      });
    }
  },
};

export default linkedList;