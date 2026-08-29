import React from 'react';
import { motion } from 'framer-motion';
import ConceptBook from '../ConceptBook/ConceptBook.jsx';
import LearningJourney from './LearningJourney.jsx';
import './LearningPreview.css';

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const panelVariants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ARRAY = [10, 20, 30, 40, 50, 60, 70];

export default function LearningPreview() {
  return (
    <section id="experience" className="preview">
      <div className="preview__inner">
        <motion.header
          className="preview__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <p className="preview__label">The UNBOX Experience</p>
          <h2 className="preview__heading">Open a concept. Understand what's inside.</h2>
          <p className="preview__subtitle">
            Every concept is broken down into simple explanations, interactive
            visualizations, examples, and challenges.
          </p>
        </motion.header>

        <div className="preview__body">
          <motion.div
            className="preview__card"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={panelVariants}
          >
            <ConceptBook
              variant="large"
              cover={{
                id: 'bs-large',
                label: 'Data Structures',
                title: 'Binary Search',
                hint: 'Open to understand',
              }}
              content={{
                eyebrow: 'Binary Search',
                title: 'What is it?',
                description:
                  'An efficient algorithm for finding an element in a sorted collection.',
                children: (
                  <div className="preview__miniviz">
                    <div className="preview__mini-array">
                      {ARRAY.map((value, index) => (
                        <span
                          className={
                            'preview__mini-cell' +
                            (value === 60 ? ' preview__mini-cell--found' : '')
                          }
                          key={index}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                    <p className="preview__mini-target">Target: 60</p>
                  </div>
                ),
                cta: 'Start Learning',
              }}
            />
          </motion.div>

          <motion.div
            className="preview__journey"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={panelVariants}
          >
            <LearningJourney />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
