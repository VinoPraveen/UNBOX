import './PlaygroundOutput.css';

export default function PlaygroundOutput({ label = 'Visualization', children }) {
  return (
    <section className="playground-output" aria-label={label}>
      <span className="playground-output__label">{label}</span>
      <div className="playground-output__body">{children}</div>
    </section>
  );
}
