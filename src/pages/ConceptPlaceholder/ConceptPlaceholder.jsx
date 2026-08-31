import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import concepts from '../../data/concepts.js';
import './ConceptPlaceholder.css';

export default function ConceptPlaceholder() {
  const { conceptId } = useParams();
  const concept = concepts.find((c) => c.id === conceptId);

  if (!concept) {
    return (
      <main className="placeholder-page">
        <div className="placeholder-page__inner">
          <Link to="/explore" className="placeholder-page__back">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Explore
          </Link>
          <h1 className="placeholder-page__heading">Concept not found</h1>
          <p className="placeholder-page__text">
            This concept doesn&apos;t exist yet. Check back soon.
          </p>
          <Link to="/explore" className="btn btn-gold">
            Explore Concepts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="placeholder-page">
      <div className="placeholder-page__inner">
        <Link to="/explore" className="placeholder-page__back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Explore
        </Link>

        <motion.div
          className="placeholder-page__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="placeholder-page__icon"
            style={{ color: concept.accent, borderColor: concept.accent, backgroundColor: concept.tint }}
          >
            <concept.Icon size={32} strokeWidth={1.75} aria-hidden="true" />
          </div>

          <p className="placeholder-page__category" style={{ color: concept.accent }}>
            {concept.category}
          </p>

          <h1 className="placeholder-page__heading">{concept.title}</h1>

          <p className="placeholder-page__text">{concept.description}</p>

          <div className="placeholder-page__badge">
            {concept.difficulty}
          </div>

          <div className="placeholder-page__coming">
            <div className="placeholder-page__coming-line" aria-hidden="true" />
            <span className="placeholder-page__coming-text">Coming in Phase 2.2</span>
            <div className="placeholder-page__coming-line" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
