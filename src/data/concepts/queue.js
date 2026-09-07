import { List } from 'lucide-react';

const queue = {
  slug: 'queue',
  title: 'Queue',
  category: 'Data Structures',
  difficulty: 'Beginner',
  estimatedTime: '5 min',
  description:
    'Understand FIFO and how queues manage data in real-world systems.',
  Icon: List,
  accent: '#A78BFA',
  tint: 'rgba(167, 139, 250, 0.1)',
  visualization: 'queue',
  visualizationBlurb:
    'Enqueue and dequeue elements to see how a queue manages data in FIFO order.',
  overview: {
    heading: 'What is a Queue?',
    body: 'A queue is a linear data structure that follows the First In, First Out (FIFO) principle. The first element added to the queue is the first one to be removed. Think of it like a line at a store \u2014 the first person in line gets served first.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Enqueue adds to the rear.',
        description:
          'A new element is added to the back of the queue. All existing elements stay in order.',
      },
      {
        number: 2,
        title: 'Dequeue removes from the front.',
        description:
          'The front element is removed. Everything behind it shifts forward.',
      },
      {
        number: 3,
        title: 'FIFO ordering.',
        description:
          'The oldest element is always the first to be removed. This is why queues are used for task scheduling, print queues, and breadth-first search.',
      },
      {
        number: 4,
        title: 'Peek at the front.',
        description:
          'You can inspect the front element without removing it, which is useful for checking what would be dequeued next.',
      },
    ],
  },
};

export default queue;
