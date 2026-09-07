import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PlaygroundHeader.css';

export default function PlaygroundHeader({ title, description, backTo }) {
  return (
    <header className="playground-header">
      <Link to={backTo} className="playground-header__back">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Concept
      </Link>
      <span className="playground-header__label">PLAYGROUND</span>
      <h1 className="playground-header__title">{title}</h1>
      <p className="playground-header__description">{description}</p>
    </header>
  );
}
