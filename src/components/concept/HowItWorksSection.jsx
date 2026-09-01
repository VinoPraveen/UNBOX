import { motion } from 'framer-motion';
import './HowItWorksSection.css';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export default function HowItWorksSection({ howItWorks }) {
  const { heading, steps } = howItWorks;

  return (
    <section id="how-it-works" className="concept-section concept-how">
      <div className="concept-section__inner">
        <motion.h2
          className="concept-section__heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stepVariants}
        >
          {heading}
        </motion.h2>

        <motion.ol
          className="concept-how__steps"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.li key={step.number} className="concept-how__step" variants={stepVariants}>
              <span className="concept-how__number">{String(step.number).padStart(2, '0')}</span>
              <div className="concept-how__copy">
                <h3 className="concept-how__title">{step.title}</h3>
                <p className="concept-how__description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <span className="concept-how__connector" aria-hidden="true" />
              )}
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
