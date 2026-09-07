import { Layers } from 'lucide-react';

const stack = {
  slug: 'stack',
  title: 'Stack',
  category: 'Data Structures',
  difficulty: 'Beginner',
  estimatedTime: '5 min',
  description:
    'Learn LIFO through an interactive stack and understand push and pop operations.',
  Icon: Layers,
  accent: '#A78BFA',
  tint: 'rgba(167, 139, 250, 0.1)',
  visualization: 'stack',
  visualizationBlurb:
    'Push and pop elements to see how a stack manages data in LIFO order.',
  overview: {
    heading: 'What is a Stack?',
    body: 'A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. The last element added to the stack is the first one to be removed. Think of it like a stack of plates \u2014 you can only add or remove from the top.',
  },
  howItWorks: {
    heading: 'How Does It Work?',
    steps: [
      {
        number: 1,
        title: 'Push adds to the top.',
        description:
          'A new element is placed on top of the stack. All existing elements stay in place.',
      },
      {
        number: 2,
        title: 'Pop removes from the top.',
        description:
          'The topmost element is removed. The element below becomes the new top.',
      },
      {
        number: 3,
        title: 'LIFO ordering.',
        description:
          'The most recently added element is always the first to be removed. This is why stacks are used for undo operations, function call stacks, and backtracking.',
      },
      {
        number: 4,
        title: 'Peek without removing.',
        description:
          'You can inspect the top element without removing it, which is useful for checking what would be popped next.',
      },
    ],
  },
};

export default stack;
