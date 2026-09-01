import './VisualizationContainer.css';

export default function VisualizationContainer({ children, className = '' }) {
  return (
    <div className={'viz-container' + (className ? ' ' + className : '')}>
      {children}
    </div>
  );
}
