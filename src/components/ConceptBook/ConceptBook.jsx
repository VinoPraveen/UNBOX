import React, { useState } from 'react';
import './ConceptBook.css';

export default function ConceptBook({
  variant = 'compact',
  cover,
  content,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `book-content-${cover.id}`;

  const toggle = () => setIsOpen((open) => !open);

  return (
    <div
      className={
        `book book--${variant} ${className}`.trim() +
        (isOpen ? ' is-open' : '')
      }
    >
      <div className="book__stage">
        <div className="book__content" id={contentId}>
          {content.eyebrow && (
            <p className="book__content-eyebrow">{content.eyebrow}</p>
          )}
          <h3 className="book__content-title">{content.title}</h3>
          {content.description && (
            <p className="book__content-description">{content.description}</p>
          )}
          {content.meta && (
            <p className="book__content-meta">{content.meta}</p>
          )}
          {content.children}
          {content.cta && (
            <span className="book__content-cta">{content.cta}</span>
          )}
        </div>

        <button
          type="button"
          className="book__cover"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-label={`${cover.label}. ${cover.title}. ${cover.hint}`}
        >
          <div className="book__cover-inner">
            <span className="book__cover-spine" aria-hidden="true" />
            <span className="book__cover-label">{cover.label}</span>
            <span className="book__cover-title">{cover.title}</span>
            <span className="book__cover-hint">{cover.hint}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
