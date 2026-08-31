import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ExploreConceptCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const iconVariants = {
  hover: {
    scale: 1.08,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const arrowVariants = {
  hover: { x: 5, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function ExploreConceptCard({ concept }) {
  const { id, title, category, difficulty, description, accent, tint, Icon } = concept;

  return (
    <motion.article
      className="explore-card"
      variants={cardVariants}
      whileHover="hover"
      style={{ '--card-accent': accent, '--card-tint': tint }}
    >
      <Link to={`/explore/${id}`} className="explore-card__link">
        <div className="explore-card__top">
          <motion.div
            className="explore-card__icon"
            variants={iconVariants}
            style={{ color: accent }}
          >
            <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
          </motion.div>

          <span
            className="explore-card__category"
            style={{ color: accent, backgroundColor: tint }}
          >
            {category}
          </span>
        </div>

        <h3 className="explore-card__title">{title}</h3>

        <p className="explore-card__description">{description}</p>

        <div className="explore-card__bottom">
          <span className="explore-card__difficulty">{difficulty}</span>
          <motion.span className="explore-card__arrow" variants={arrowVariants} aria-hidden="true">
            Explore <ArrowRight size={16} />
          </motion.span>
        </div>
      </Link>
    </motion.article>
  );
}
