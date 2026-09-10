function createQueueNode(value) {
  return { value, next: null };
}

export function createQueue() {
  let head = null;
  let tail = null;
  let count = 0;

  return {
    enqueue(value) {
      const node = createQueueNode(value);
      if (tail) tail.next = node;
      else head = node;
      tail = node;
      count += 1;
      return this;
    },
    dequeue() {
      if (!head) return undefined;
      const value = head.value;
      head = head.next;
      count -= 1;
      if (!head) tail = null;
      return value;
    },
    peek() {
      return head ? head.value : undefined;
    },
    front() {
      return head ? head.value : undefined;
    },
    rear() {
      return tail ? tail.value : undefined;
    },
    clear() {
      head = null;
      tail = null;
      count = 0;
    },
    get size() {
      return count;
    },
    get isEmpty() {
      return count === 0;
    },
    toArray() {
      const out = [];
      let current = head;
      while (current) {
        out.push(current.value);
        current = current.next;
      }
      return out;
    },
  };
}

export function rebuildQueue(items) {
  const queue = createQueue();
  for (const value of items) queue.enqueue(value);
  return queue;
}