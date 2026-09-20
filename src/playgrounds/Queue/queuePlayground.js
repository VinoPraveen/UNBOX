import QueuePlayground from './QueuePlayground.jsx';
import { rebuildQueue } from '../../dataStructures/queue.js';
import { parseNumber, withHistory } from '../dataStructureShared.js';

function base(prev) {
  return {
    items: prev?.items ?? [],
    history: prev?.history ?? [],
    lastMessage: prev?.lastMessage ?? '',
    meta: prev?.meta ?? {},
    kind: 'queue',
  };
}

const queue = {
  slug: 'queue',
  title: 'Queue',
  description: 'Enqueue values at the rear and dequeue from the front. See FIFO in action.',
  experience: 'full',
  conceptSlug: 'queue',
  algorithmSlug: 'queue',
  persistent: true,
  inputs: [
    {
      id: 'value',
      label: 'Value',
      type: 'number',
      placeholder: '42',
      help: 'The number to enqueue or use with an operation.',
    },
  ],
  operations: [
    { id: 'enqueue', label: 'Enqueue', variant: 'gold', ariaLabel: 'Enqueue a value at the rear of the queue' },
    { id: 'dequeue', label: 'Dequeue', variant: 'navy', ariaLabel: 'Dequeue the front value from the queue' },
    { id: 'front', label: 'Front', variant: 'ghost', ariaLabel: 'View the front value without removing it' },
    { id: 'rear', label: 'Rear', variant: 'ghost', ariaLabel: 'View the rear value without removing it' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the queue' },
  ],
  disabled: () => ({}),
  Component: QueuePlayground,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = base(experiment);

    if (opId === 'enqueue') {
      const parsed = parseNumber(values.value);
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before pressing Enqueue.',
        });
        return;
      }
      setErrors({});
      const queue = rebuildQueue(state.items);
      queue.enqueue(parsed.value);
      const items = queue.toArray();
      const message = `Enqueued ${parsed.value}`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'enqueue', value: parsed.value },
      });
      setStatus({
        kind: 'success',
        title: 'Enqueued.',
        detail: `${parsed.value} joined the rear of the queue.`,
      });
      return;
    }

    if (opId === 'dequeue') {
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'Queue underflow.',
          detail: 'You can\u2019t dequeue from an empty queue. Enqueue a value first.',
        });
        return;
      }
      const queue = rebuildQueue(state.items);
      const value = queue.dequeue();
      const items = queue.toArray();
      const message = `Dequeued ${value}`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'dequeue', value },
      });
      setStatus({
        kind: 'success',
        title: 'Dequeued.',
        detail: `${value} left the front of the queue.`,
      });
      return;
    }

    if (opId === 'front' || opId === 'rear') {
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'Queue is empty.',
          detail: 'There is no value to inspect. Enqueue a value first.',
        });
        return;
      }
      const value = opId === 'front' ? state.items[0] : state.items[state.items.length - 1];
      const message = `${opId === 'front' ? 'Front' : 'Rear'} \u2014 ${value}`;
      setExperiment({
        ...state,
        lastMessage: message,
        meta: { action: opId, value },
      });
      setStatus({
        kind: 'success',
        title: opId === 'front' ? 'Front.' : 'Rear.',
        detail: `The ${opId === 'front' ? 'front' : 'rear'} value is ${value}.`,
      });
      return;
    }

    if (opId === 'clear') {
      const previous = state.items;
      const message =
        previous.length === 0
          ? 'Clear \u2014 the queue was already empty'
          : `Cleared the queue (removed ${previous.length} item${previous.length === 1 ? '' : 's'})`;
      setExperiment({
        ...state,
        items: [],
        history: withHistory(state.history, message, previous),
        lastMessage: 'Cleared the queue.',
        meta: { action: 'clear' },
      });
      setStatus({
        kind: 'success',
        title: 'Cleared.',
        detail: 'The queue is now empty.',
      });
      return;
    }

    if (opId === 'undo') {
      const last = state.history[state.history.length - 1];
      if (!last) {
        setStatus({
          kind: 'idle',
          title: 'Nothing to undo.',
          detail: 'The queue is already at its starting state.',
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

export default queue;