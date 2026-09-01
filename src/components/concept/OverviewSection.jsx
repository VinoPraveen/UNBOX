import { motion } from 'framer-motion';
import './OverviewSection.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export default function OverviewSection({ overview, accent, tint }) {
  const { heading, body, array, target } = overview;
  const hasVisual = Array.isArray(array) && array.length > 0;

  return (
    <section id="overview" className="concept-section concept-overview">
      <div className="concept-section__inner">
        <motion.div
          className="concept-section__content"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={sectionVariants}
        >
          <h2 className="concept-section__heading">{heading}</h2>
          <p className="concept-section__body">{body}</p>
        </motion.div>

        {hasVisual && (
          <motion.div
            className="concept-overview__visual"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
            aria-label={`Sorted array ${array.join(', ')}. Target value ${target}.`}
          >
            <motion.ol className="concept-overview__array" variants={listVariants}>
              {array.map((value, index) => {
                const isTarget = value === target;
                return (
                  <motion.li key={index} variants={cellVariants}>
                    <span
                      className={
                        'concept-overview__cell' +
                        (isTarget ? ' concept-overview__cell--target' : '')
                      }
                      style={isTarget ? { borderColor: accent, color: accent } : undefined}
                    >
                      {value}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ol>

            <p
              className="concept-overview__target"
              style={{ '--target-accent': accent, backgroundColor: tint }}
            >
              Target: <strong>{target}</strong>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
