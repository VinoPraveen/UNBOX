import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import './ConceptHeader.css';

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ConceptHeader({ concept }) {
  return (
    <motion.header
      className="concept-header"
      initial="hidden"
      animate="show"
      variants={headerVariants}
    >
      <div className="concept-header__inner">
        <Link to="/explore" className="concept-header__back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Explore
        </Link>

        <p className="concept-header__category" style={{ color: concept.accent }}>
          {concept.category}
        </p>

        <h1 className="concept-header__title">{concept.title}</h1>
        <p className="concept-header__description">{concept.description}</p>

        <div className="concept-header__meta">
          <span className="concept-header__badge">
            <span className="concept-header__badge-label">Difficulty</span>
            <span className="concept-header__badge-value">{concept.difficulty}</span>
          </span>
          <span className="concept-header__badge">
            <span className="concept-header__badge-label">Estimated time</span>
            <span className="concept-header__badge-value">
              <Clock size={13} aria-hidden="true" />
              {concept.estimatedTime}
            </span>
          </span>
        </div>
      </div>
    </motion.header>
  );
}
