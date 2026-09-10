function createLinkedListNode(value, next = null) {
  return { value, next };
}

export function createLinkedList() {
  let head = null;
  let tail = null;
  let count = 0;

  const insertAtBeginning = (value) => {
    const node = createLinkedListNode(value, head);
    head = node;
    if (!tail) tail = node;
    count += 1;
  };

  const insertAtEnd = (value) => {
    const node = createLinkedListNode(value);
    if (!head) head = node;
    else tail.next = node;
    tail = node;
    count += 1;
  };

  const toArray = () => {
    const out = [];
    let current = head;
    while (current) {
      out.push(current.value);
      current = current.next;
    }
    return out;
  };

  return {
    insertAtBeginning,
    insertAtEnd,
    insertAtIndex(value, index) {
      if (!Number.isInteger(index) || index < 0) {
        return { ok: false, reason: 'invalid-index' };
      }
      if (index === 0) {
        insertAtBeginning(value);
        return { ok: true };
      }
      if (index > count) {
        return { ok: false, reason: 'invalid-index', maxIndex: count };
      }
      let previous = head;
      for (let i = 0; i < index - 1; i += 1) previous = previous.next;
      const node = createLinkedListNode(value, previous.next);
      previous.next = node;
      if (!node.next) tail = node;
      count += 1;
      return { ok: true };
    },
    deleteByValue(value) {
      if (!head) return { ok: false, reason: 'empty', removed: undefined, index: -1 };
      if (head.value === value) {
        const removed = head.value;
        head = head.next;
        count -= 1;
        if (!head) tail = null;
        return { ok: true, removed, index: 0 };
      }
      let previous = head;
      let current = head.next;
      let index = 1;
      while (current) {
        if (current.value === value) {
          const removed = current.value;
          previous.next = current.next;
          if (!current.next) tail = previous;
          count -= 1;
          return { ok: true, removed, index };
        }
        previous = current;
        current = current.next;
        index += 1;
      }
      return { ok: false, reason: 'not-found', removed: undefined, index: -1 };
    },
    search(value) {
      const trail = [];
      let current = head;
      let index = 0;
      while (current) {
        trail.push({ value: current.value, index });
        if (current.value === value) {
          return { found: true, index, comparisons: index + 1, trail };
        }
        current = current.next;
        index += 1;
      }
      return { found: false, index: -1, comparisons: index, trail };
    },
    get(index) {
      if (!Number.isInteger(index) || index < 0 || index >= count) return undefined;
      let current = head;
      for (let i = 0; i < index; i += 1) current = current.next;
      return current.value;
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
    get headValue() {
      return head ? head.value : undefined;
    },
    get tailValue() {
      return tail ? tail.value : undefined;
    },
    toArray,
    toNodes() {
      const out = [];
      let current = head;
      while (current) {
        out.push({ value: current.value, hasNext: Boolean(current.next) });
        current = current.next;
      }
      return out;
    },
  };
}

export function rebuildLinkedList(items) {
  const list = createLinkedList();
  for (const value of items) list.insertAtEnd(value);
  return list;
}