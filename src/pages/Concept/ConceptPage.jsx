import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getConceptData } from '../../data/concepts/registry.js';
import ConceptHeader from '../../components/concept/ConceptHeader.jsx';
import ConceptNav from '../../components/concept/ConceptNav.jsx';
import ConceptProgress from '../../components/concept/ConceptProgress.jsx';
import OverviewSection from '../../components/concept/OverviewSection.jsx';
import HowItWorksSection from '../../components/concept/HowItWorksSection.jsx';
import VisualizationSection from '../../components/concept/VisualizationSection.jsx';
import './ConceptPage.css';

const PREVIEW_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'practice', label: 'Practice' },
  { id: 'challenge', label: 'Challenge' },
];

const PROGRESS_STAGES = [
  { id: 'overview', label: 'Understand' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'practice', label: 'Practice' },
  { id: 'challenge', label: 'Challenge' },
];

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function NotFound() {
  return (
    <main className="concept-notfound">
      <div className="concept-notfound__inner">
        <motion.div
          className="concept-notfound__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Link to="/explore" className="concept-notfound__back">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Explore
          </Link>
          <h1 className="concept-notfound__heading">Concept not found</h1>
          <p className="concept-notfound__text">
            This concept doesn&apos;t exist yet. Try a different one from the library.
          </p>
          <Link to="/explore" className="btn btn-gold">
            Explore Concepts
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function PreviewSection({ id, title, text, to }) {
  return (
    <motion.section
      id={id}
      className="concept-preview concept-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={revealVariants}
    >
      <div className="concept-preview__inner concept-section__inner">
        <h2 className="concept-preview__title">{title}</h2>
        <p className="concept-preview__text">{text}</p>
        <Link to={to} className="btn btn-gold">
          {id === 'challenge' ? 'Take the Challenge' : 'Open Playground'}
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.section>
  );
}

export default function ConceptPage() {
  const { slug } = useParams();
  const concept = getConceptData(slug);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const ids = PREVIEW_SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slug]);

  if (!concept) {
    return <NotFound />;
  }

  return (
    <main className="concept-page">
      <ConceptHeader concept={concept} />
      <ConceptNav items={PREVIEW_SECTIONS} active={activeSection} />
      <ConceptProgress stages={PROGRESS_STAGES} active={activeSection} />

      <OverviewSection
        overview={concept.overview}
        accent={concept.accent}
        tint={concept.tint}
      />
      <HowItWorksSection howItWorks={concept.howItWorks} />
      <VisualizationSection concept={concept} />

      <PreviewSection
        id="practice"
        title="Ready to try it yourself?"
        text="Change the numbers, choose a target, and see binary search find it."
        to={`/playground/${concept.slug}`}
      />

      <PreviewSection
        id="challenge"
        title="Think you've got it?"
        text="Test your understanding with a quick challenge."
        to={`/quiz/${concept.slug}`}
      />
    </main>
  );
}
