export function createStack() {
  const items = [];

  return {
    push(value) {
      items.push(value);
      return this;
    },
    pop() {
      return items.length === 0 ? undefined : items.pop();
    },
    peek() {
      return items.length === 0 ? undefined : items[items.length - 1];
    },
    clear() {
      items.length = 0;
    },
    get size() {
      return items.length;
    },
    get isEmpty() {
      return items.length === 0;
    },
    get top() {
      return items.length === 0 ? undefined : items[items.length - 1];
    },
    toArray() {
      return [...items];
    },
  };
}

export function rebuildStack(items) {
  const stack = createStack();
  for (const value of items) stack.push(value);
  return stack;
}