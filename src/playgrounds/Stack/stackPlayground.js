import StackPlayground from './StackPlayground.jsx';
import { rebuildStack } from '../../dataStructures/stack.js';
import { parseNumber, withHistory } from '../dataStructureShared.js';

function base(prev) {
  return {
    items: prev?.items ?? [],
    history: prev?.history ?? [],
    lastMessage: prev?.lastMessage ?? '',
    meta: prev?.meta ?? {},
    kind: 'stack',
  };
}

const stack = {
  slug: 'stack',
  title: 'Stack',
  description: 'Push values onto the stack and pop the top. See LIFO in action.',
  experience: 'full',
  conceptSlug: 'stack',
  algorithmSlug: 'stack',
  persistent: true,
  inputs: [
    {
      id: 'value',
      label: 'Value',
      type: 'number',
      placeholder: '42',
      help: 'The number to push or use with an operation.',
    },
  ],
  operations: [
    { id: 'push', label: 'Push', variant: 'gold', ariaLabel: 'Push a value onto the stack' },
    { id: 'pop', label: 'Pop', variant: 'navy', ariaLabel: 'Pop the top value off the stack' },
    { id: 'peek', label: 'Peek', variant: 'ghost', ariaLabel: 'Peek at the top value without removing it' },
    { id: 'clear', label: 'Clear', variant: 'ghost', ariaLabel: 'Clear the stack' },
  ],
  disabled: () => ({}),
  Component: StackPlayground,
  onAction(opId, values, { setErrors, setStatus, setExperiment, experiment }) {
    const state = base(experiment);
    const valueField = values.value;

    if (opId === 'push') {
      const parsed = parseNumber(valueField);
      if (!parsed.ok) {
        setErrors({ value: 'Please enter a value.' });
        setStatus({
          kind: 'error',
          title: 'Please enter a value.',
          detail: 'Type a number before pressing Push.',
        });
        return;
      }
      setErrors({});
      const stack = rebuildStack(state.items);
      stack.push(parsed.value);
      const items = stack.toArray();
      const message = `Pushed ${parsed.value}`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'push', value: parsed.value },
      });
      setStatus({
        kind: 'success',
        title: 'Pushed.',
        detail: `${parsed.value} is now on top of the stack.`,
      });
      return;
    }

    if (opId === 'pop') {
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'Stack underflow.',
          detail: 'You can\u2019t pop from an empty stack. Push a value first.',
        });
        return;
      }
      const stack = rebuildStack(state.items);
      const value = stack.pop();
      const items = stack.toArray();
      const message = `Popped ${value}`;
      setExperiment({
        ...state,
        items,
        history: withHistory(state.history, message, state.items),
        lastMessage: message,
        meta: { action: 'pop', value },
      });
      setStatus({
        kind: 'success',
        title: 'Popped.',
        detail: `${value} was removed from the top of the stack.`,
      });
      return;
    }

    if (opId === 'peek') {
      if (state.items.length === 0) {
        setStatus({
          kind: 'error',
          title: 'Stack is empty.',
          detail: 'There is no top value to peek at. Push a value first.',
        });
        return;
      }
      const value = state.items[state.items.length - 1];
      const message = `Peeked ${value}`;
      setExperiment({
        ...state,
        lastMessage: message,
        meta: { action: 'peek', value },
      });
      setStatus({
        kind: 'success',
        title: 'Peeked.',
        detail: `The top value is ${value}. Peek does not remove it.`,
      });
      return;
    }

    if (opId === 'clear') {
      const previous = state.items;
      const message =
        previous.length === 0
          ? 'Clear \u2014 the stack was already empty'
          : `Cleared the stack (removed ${previous.length} item${previous.length === 1 ? '' : 's'})`;
      setExperiment({
        ...state,
        items: [],
        history: withHistory(state.history, message, previous),
        lastMessage: 'Cleared the stack.',
        meta: { action: 'clear' },
      });
      setStatus({
        kind: 'success',
        title: 'Cleared.',
        detail: 'The stack is now empty.',
      });
      return;
    }

    if (opId === 'undo') {
      const last = state.history[state.history.length - 1];
      if (!last) {
        setStatus({
          kind: 'idle',
          title: 'Nothing to undo.',
          detail: 'The stack is already at its starting state.',
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

export default stack;