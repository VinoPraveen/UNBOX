import { motion } from 'framer-motion';
import { Eye, FlaskConical, CircleCheck } from 'lucide-react';
import LearningMethodCard from './LearningMethodCard.jsx';
import './LearningMethods.css';

const METHODS = [
  {
    id: 'visualize',
    Icon: Eye,
    title: 'Visualize',
    description:
      'Watch concepts come to life through interactive animations and step-by-step visualizations.',
    accent: '#A78BFA',
  },
  {
    id: 'experiment',
    Icon: FlaskConical,
    title: 'Experiment',
    description:
      'Change inputs, interact with the concept, and see how everything responds.',
    accent: '#22D3EE',
  },
  {
    id: 'test',
    Icon: CircleCheck,
    title: 'Test',
    description:
      'Challenge yourself with interactive questions and find out what you really understand.',
    accent: '#A3FF12',
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function LearningMethods() {
  return (
    <section id="experience" className="methods">
      <div className="methods__inner">
        <motion.header
          className="methods__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <p className="methods__label">The UNBOX Experience</p>
          <h2 className="methods__heading">Learn it your way.</h2>
          <p className="methods__subtitle">
            One concept. Multiple ways to understand it.
          </p>
        </motion.header>

        <div className="methods__grid-wrap">
          <div className="methods__line" aria-hidden="true" />
          <motion.ol
            className="methods__grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={gridVariants}
          >
            {METHODS.map((method) => (
              <LearningMethodCard key={method.id} method={method} />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}