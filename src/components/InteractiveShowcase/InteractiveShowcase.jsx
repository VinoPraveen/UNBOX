import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import BinarySearchVisualizer from './BinarySearchVisualizer.jsx';
import { STEPS, TARGET, narrationFor } from './binarySearchSteps.js';
import './InteractiveShowcase.css';

const TOTAL = STEPS.length;

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const bodyVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
  },
};

function ExplanationPanel({ narration }) {
  return (
    <aside className="showcase__panel" aria-label={`Step explanation. ${narration.badge}`}>
      <div className="showcase__panel-head">
        <span className="showcase__current">Current Step</span>
        <span className="showcase__badge">{narration.badge}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={narration.key}
          className="showcase__copy"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <h3 className="showcase__text">{narration.heading}</h3>
          <p className="showcase__detail">{narration.detail}</p>
          {narration.found && (
            <motion.p
              className="showcase__found"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Check size={16} strokeWidth={2.5} />
              Found {TARGET}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <ul className="showcase__complexity">
        <li className="showcase__complexity-item">
          <span>Time Complexity</span>
          <strong>O(log n)</strong>
        </li>
        <li className="showcase__complexity-item">
          <span>Space Complexity</span>
          <strong>O(1)</strong>
        </li>
      </ul>
    </aside>
  );
}

export default function InteractiveShowcase() {
  const [step, setStep] = useState(1);
  const snapshot = STEPS[step - 1];
  const narration = narrationFor(step);

  const handleNext = () => setStep((current) => Math.min(current + 1, TOTAL));
  const handlePrev = () => setStep((current) => Math.max(current - 1, 1));
  const handleReset = () => setStep(1);

  return (
    <section id="showcase" className="showcase">
      <div className="showcase__inner">
        <motion.header
          className="showcase__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <p className="showcase__label">Interactive Visualization</p>
          <h2 className="showcase__heading">Don't just read it. Watch it happen.</h2>
          <p className="showcase__subtitle">
            See a concept unfold step by step. Interact with the process and
            understand what's happening underneath.
          </p>
        </motion.header>

        <motion.div
          className="showcase__body"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={bodyVariants}
        >
          <BinarySearchVisualizer
            step={step}
            total={TOTAL}
            snapshot={snapshot}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
          />

          <ExplanationPanel narration={narration} />
        </motion.div>
      </div>
    </section>
  );
}