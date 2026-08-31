import { motion } from 'framer-motion';
import { ArrowRight, Boxes, Binary, Globe, Cpu } from 'lucide-react';
import ConceptCard from './ConceptCard.jsx';
import './ExploreConcepts.css';

const CONCEPTS = [
  {
    title: 'Arrays',
    category: 'Data Structures',
    description: 'Understand arrays, operations, and real-world use cases.',
    accent: '#A78BFA',
    tint: 'rgba(124, 58, 237, 0.1)',
    Icon: Boxes,
  },
  {
    title: 'Binary Search',
    category: 'Algorithms',
    description: 'Learn efficient searching using divide and conquer.',
    accent: '#A78BFA',
    tint: 'rgba(124, 58, 237, 0.1)',
    Icon: Binary,
  },
  {
    title: 'HTTP',
    category: 'Networking',
    description: 'Explore how the web works behind the scenes.',
    accent: '#22D3EE',
    tint: 'rgba(34, 211, 238, 0.1)',
    Icon: Globe,
  },
  {
    title: 'Operating Systems',
    category: 'OS',
    description: 'Learn process management, memory, and more.',
    accent: '#A3FF12',
    tint: 'rgba(163, 255, 18, 0.1)',
    Icon: Cpu,
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export default function ExploreConcepts() {
  return (
    <section id="concepts" className="explore">
      <div className="explore__inner">
        <motion.div
          className="explore__header"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={headerVariants}
        >
          <h2 className="explore__heading">Explore Concepts</h2>
          <p className="explore__subtitle">
            Dive into interactive visualizations and understand core computer
            science concepts deeply.
          </p>
        </motion.div>

        <motion.div
          className="explore__grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
        >
          {CONCEPTS.map((concept) => (
            <ConceptCard key={concept.title} concept={concept} />
          ))}
        </motion.div>

        <div className="explore__footer">
          <motion.a
            className="btn explore__view"
            href="#explore"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Concepts
            <ArrowRight size={18} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}