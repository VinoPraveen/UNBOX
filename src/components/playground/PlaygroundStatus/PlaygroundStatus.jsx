import { motion } from 'framer-motion';
import { CircleAlert, LoaderCircle, CircleCheck, Info, SearchX } from 'lucide-react';
import './PlaygroundStatus.css';

const STATUS_ICONS = {
  idle: Info,
  running: LoaderCircle,
  success: CircleCheck,
  error: CircleAlert,
  notice: SearchX,
};

const variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function PlaygroundStatus({ status = 'idle', title, detail }) {
  const Icon = STATUS_ICONS[status] ?? Info;
  const icon =
    status === 'running' ? (
      <Icon size={18} className="playground-status__spin" aria-hidden="true" />
    ) : (
      <Icon size={18} aria-hidden="true" />
    );

  return (
    <motion.div
      className={`playground-status playground-status--${status}`}
      role="status"
      aria-live="polite"
      initial="hidden"
      animate="show"
      variants={variants}
      key={status + title}
    >
      <span className="playground-status__icon">{icon}</span>
      <div className="playground-status__body">
        <span className="playground-status__label">{title}</span>
        {detail ? <span className="playground-status__detail">{detail}</span> : null}
      </div>
    </motion.div>
  );
}
