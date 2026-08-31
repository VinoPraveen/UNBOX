import { motion } from 'framer-motion';
import { Search, PackageOpen, Lightbulb } from 'lucide-react';
import './HowItWorks.css';

const STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'Find the concept you want to understand.',
    Icon: Search,
  },
  {
    number: '02',
    title: 'Unbox',
    description:
      'Break it down with interactive visualizations and step-by-step explanations.',
    Icon: PackageOpen,
  },
  {
    number: '03',
    title: 'Understand',
    description:
      'Apply what you learned with examples and interactive challenges.',
    Icon: Lightbulb,
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="hiw">
      <motion.div
        className="hiw__header"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
      >
        <h2 className="hiw__heading">How UNBOX Works</h2>
        <p className="hiw__subtitle">
          Learn by opening concepts, not memorizing them.
        </p>
      </motion.div>

      <motion.ol
        className="hiw__steps"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.span
          className="hiw__line"
          aria-hidden="true"
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            show: { scaleX: 1, opacity: 1 },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {STEPS.map(({ number, title, description, Icon }) => (
          <motion.li className="hiw__step" key={number} variants={stepVariants}>
            <div className="hiw__marker">
              <span className="hiw__number">{number}</span>
              <span className="hiw__icon">
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
            <div className="hiw__body">
              <h3 className="hiw__title">{title}</h3>
              <p className="hiw__description">{description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
