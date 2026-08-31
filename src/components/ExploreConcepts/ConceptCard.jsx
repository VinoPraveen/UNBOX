import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './ConceptCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  hover: { y: -6, transition: { duration: 0.2, ease: 'easeOut' } },
};

const iconVariants = {
  hover: {
    y: -2,
    scale: 1.06,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const arrowVariants = {
  hover: { x: 5, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function ConceptCard({ concept }) {
  const { title, category, description, accent, tint, Icon } = concept;

  return (
    <motion.article
      className="concept-card"
      variants={cardVariants}
      whileHover="hover"
      style={{ '--card-accent': accent, '--card-tint': tint }}
    >
      <motion.div
        className="concept-card__icon"
        variants={iconVariants}
        style={{ color: accent }}
      >
        <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
      </motion.div>

      <h3 className="concept-card__title">{title}</h3>

      <span
        className="concept-card__badge"
        style={{ color: accent, backgroundColor: tint }}
      >
        {category}
      </span>

      <p className="concept-card__description">{description}</p>

      <motion.span
        className="concept-card__arrow"
        variants={arrowVariants}
        aria-hidden="true"
      >
        <ArrowRight size={20} />
      </motion.span>
    </motion.article>
  );
}