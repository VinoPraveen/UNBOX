import React from 'react';
import { motion } from 'framer-motion';
import './LearningJourney.css';

const STEPS = [
  {
    number: '01',
    title: 'What is it?',
    description: 'Start with a simple explanation.',
  },
  {
    number: '02',
    title: 'How does it work?',
    description: 'Break the concept into understandable steps.',
  },
  {
    number: '03',
    title: 'See it visually',
    description: 'Watch the concept operate in real time.',
  },
  {
    number: '04',
    title: 'Try it yourself',
    description: 'Interact and experiment.',
  },
  {
    number: '05',
    title: 'Test your knowledge',
    description: 'Check whether you really understood it.',
  },
];

const stepVariants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function LearningJourney() {
  return (
    <div className="journey">
      <p className="journey__label">Your learning journey</p>
      <motion.ol
        className="journey__list"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
      >
        {STEPS.map((step) => (
          <motion.li className="journey__item" key={step.number} variants={stepVariants}>
            <span className="journey__num" aria-hidden="true">
              {step.number}
            </span>
            <div className="journey__body">
              <h4 className="journey__title">{step.title}</h4>
              <p className="journey__desc">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
