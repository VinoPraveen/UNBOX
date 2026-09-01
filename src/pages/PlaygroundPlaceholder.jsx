import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getConceptData } from '../data/concepts/registry.js';
import './Placeholder.css';

export default function PlaygroundPlaceholder() {
  const { slug } = useParams();
  const concept = getConceptData(slug);

  return (
    <main className="placeholder-page">
      <div className="placeholder-page__inner">
        <Link to={`/concept/${slug}`} className="placeholder-page__back">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to {concept ? concept.title : 'Concept'}
        </Link>

        <h1 className="placeholder-page__heading">Playground</h1>
        <p className="placeholder-page__text">
          {concept ? `${concept.title} Playground` : 'This playground'} is coming soon. Right now
          we&apos;re building the tools to let you change the numbers and explore on your own.
        </p>
        <Link to={`/concept/${slug}`} className="btn btn-gold">
          Back to Concept
        </Link>
      </div>
    </main>
  );
}
