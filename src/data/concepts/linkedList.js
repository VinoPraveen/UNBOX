import { Link2 } from 'lucide-react';
import { createLinkedList } from '../../dataStructures/linkedList.js';

function generateVisualizationSteps() {
  const list = createLinkedList();
  const steps = [];

  const snapshot = (key, action) => ({
    key,
    items: list.toArray(),
    pointers: [
      { index: 0, label: 'HEAD', kind: 'head' },
    ],
    status: action,
    heading: action,
    detail: 'Follow the NEXT references to move through the list.',
    facts: {
      Size: list.size,
      Head: list.headValue ?? '\u2014',
      Tail: list.tailValue ?? '\u2014',
    },
  });

  list.insertAtEnd(10);
  steps.push(snapshot(1, 'A list starts with its head node.'));
  list.insertAtEnd(20);
  steps.push(snapshot(2, 'Appending adds a node at the tail.'));
  list.insertAtBeginning(5);
  steps.push(snapshot(3, 'Inserting at the head makes a new first node.'));
  list.insertAtIndex(15, 2);
  steps.push(snapshot(4, 'Inserting at an index re-points the NEXT references.'));
  list.deleteByValue(20);
  steps.push(snapshot(5, 'Deleting links the surrounding nodes directly.'));

  return steps;
}

const linkedList = {
  slug: 'linked-list',
  title: 'Linked List',
  category: 'Data Structures',
  difficulty: 'Intermediate',
  estimatedTime: '6 min',
  description:
    'Understand how nodes connect through references and how insertion, deletion, and search work.',
  Icon: Link2,
  accent: '#A78BFA',
  tint: 'rgba(167, 139, 250, 0.1)',
  visualization: 'linked-list',
  visualizationBlurb:
    'Insert, delete, and search nodes to see how a linked list connects through NEXT references.',
  overview: {
    heading: 'What is a Linked List?',
    body: 'A linked list is a linear data structure made of nodes. Each node holds a value and a reference (NEXT) to the following node. Unlike an array, there is no single block of memory \u2014 nodes are spread out and linked together, ending with a NULL reference.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Nodes hold a value and a NEXT reference.',
        description:
          'Every node stores one value and a pointer to the next node. The first node is called the head, and the last one points to NULL.',
      },
      {
        number: 2,
        title: 'Inserting at the head is instant.',
        description:
          'A new node is added before the head, and its NEXT points to the old head. This takes constant time because no other node changes.',
      },
      {
        number: 3,
        title: 'Inserting elsewhere walks the list.',
        description:
          'To insert in the middle, the list is traversed from the head until the position is found, then the surrounding NEXT references are updated.',
      },
      {
        number: 4,
        title: 'Deleting re-links the neighbors.',
        description:
          'The predecessor node\u2019s NEXT reference is updated to skip the removed node. The removed node is no longer reachable.',
      },
    ],
  },
  visualizationSteps: generateVisualizationSteps(),
  visualizationConfig: { initialValues: [10, 20, 30] },
  complexity: { time: 'O(n)', space: 'O(n)' },
};

export default linkedList;