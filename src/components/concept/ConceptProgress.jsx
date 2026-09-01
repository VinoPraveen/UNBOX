import { motion } from 'framer-motion';
import './ConceptProgress.css';

export default function ConceptProgress({ stages, active }) {
  const activeIndex = stages.findIndex((stage) => stage.id === active);

  return (
    <motion.div
      className="concept-progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      aria-label="Your learning progress"
    >
      <p className="concept-progress__label">Your Progress</p>
      <div className="concept-progress__track">
        {stages.map((stage, index) => {
          const isDone = index < activeIndex;
          const isCurrent = index === activeIndex;
          return (
            <div className="concept-progress__segment" key={stage.id}>
              {index > 0 && (
                <span
                  className={
                    'concept-progress__line' +
                    (index <= activeIndex ? ' concept-progress__line--done' : '')
                  }
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  'concept-progress__dot' +
                  (isCurrent ? ' concept-progress__dot--current' : '') +
                  (isDone ? ' concept-progress__dot--done' : '')
                }
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
      <ol className="concept-progress__labels">
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            className={
              'concept-progress__stage' +
              (index === activeIndex ? ' concept-progress__stage--current' : '')
            }
          >
            {index + 1}. {stage.label}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
