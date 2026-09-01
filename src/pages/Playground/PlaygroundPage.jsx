import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Construction, SearchX } from 'lucide-react';
import { getPlayground } from '../../data/playgrounds/playgroundRegistry.js';
import { getConceptData } from '../../data/concepts/registry.js';
import PlaygroundShell from '../../components/playground/PlaygroundShell/PlaygroundShell.jsx';
import './PlaygroundPage.css';

function PlaygroundMessage({ icon: Icon, heading, text, to, cta }) {
  return (
    <main className="playground-message">
      <div className="playground-message__inner">
        <Icon size={40} className="playground-message__icon" aria-hidden="true" />
        <h1 className="playground-message__heading">{heading}</h1>
        <p className="playground-message__text">{text}</p>
        <Link to={to} className="btn btn-gold">
          <ArrowLeft size={16} />
          {cta}
        </Link>
      </div>
    </main>
  );
}

export default function PlaygroundPage() {
  const { slug } = useParams();
  const playground = getPlayground(slug);

  if (!playground) {
    return (
      <PlaygroundMessage
        icon={SearchX}
        heading="Playground not found."
        text={`We couldn\u2019t find a playground for \u201C${slug}\u201D.`}
        to="/explore"
        cta="Back to Explore"
      />
    );
  }

  const concept = getConceptData(playground.conceptSlug);

  if (playground.experience === 'coming-soon') {
    return (
      <PlaygroundMessage
        icon={Construction}
        heading="Playground coming soon."
        text={
          concept
            ? `The ${concept.title} playground is being prepared. You can still explore the concept in the meantime.`
            : 'This playground is being prepared. Check back soon.'
        }
        to={`/concept/${playground.slug}`}
        cta="Back to Concept"
      />
    );
  }

  return <PlaygroundShell config={{ ...playground, concept }} />;
}
