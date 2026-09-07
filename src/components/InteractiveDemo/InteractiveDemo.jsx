import { Layers } from 'lucide-react';
import StackVisualizer from '../visualizations/Stack/StackVisualizer.jsx';
import './InteractiveDemo.css';

const DEMO_CONCEPT = {
  initialValues: [10, 20, 30],
};

export default function InteractiveDemo() {
  return (
    <section className="demo" aria-label="Stack visualization demo">
      <div className="demo__header">
        <div className="demo__title">
          <span className="demo__badge">
            <Layers size={14} />
            Demo
          </span>
          <h2 className="demo__heading">How does a Stack work?</h2>
        </div>
      </div>

      <StackVisualizer concept={DEMO_CONCEPT} />
    </section>
  );
}
