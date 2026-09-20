import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered } from 'lucide-react';
import OperationHistory from '../../components/playground/OperationHistory/OperationHistory.jsx';
import './QueuePlayground.css';

const ACTION_COPY = {
  enqueue: 'Enqueue adds a value at the rear of the queue. It will wait behind the others.',
  dequeue: 'Dequeue removes the value at the front of the queue. The next value moves up.',
  front: 'Front reads the first value in line without removing it.',
  rear: 'Rear reads the last value added to the queue without removing it.',
  clear: 'Clear empties the queue and resets it to its starting state.',
  undo: 'Undo restores the queue to its state before the last operation.',
  underflow: 'The queue is empty, so there is nothing to dequeue. Enqueue a value first.',
};

function explain(experiment) {
  const meta = experiment.meta ?? {};
  let body = ACTION_COPY[meta.action] ?? ACTION_COPY.enqueue;
  if (meta.action === 'enqueue' && meta.value !== undefined) {
    body = `${meta.value} joined the end of the line. It will be dequeued last.`;
  }
  if (meta.action === 'dequeue' && meta.value !== undefined) {
    body = `${meta.value} left the front of the queue. The line moved up.`;
  }
  if (meta.action === 'front' && meta.value !== undefined) {
    body = `The front value is ${meta.value}. Front leaves the queue untouched.`;
  }
  if (meta.action === 'rear' && meta.value !== undefined) {
    body = `The rear value is ${meta.value}. Rear leaves the queue untouched.`;
  }
  return body;
}

export default function QueuePlayground({ experiment, onAction }) {
  if (!experiment) {
    return (
      <div className="dsp-idle">
        <ListOrdered size={28} aria-hidden="true" />
        <p className="dsp-idle__title">Ready to experiment.</p>
        <p className="dsp-idle__text">
          Enter a value, then press Enqueue to add it to the end of the line.
        </p>
      </div>
    );
  }

  const items = experiment.items ?? [];

  return (
    <div className="dsp-queue">
      <div className="dsp-queue__board">
        <div className="dsp-queue__labels">
          <span className="dsp-queue__label dsp-queue__label--front">FRONT</span>
          <span className="dsp-queue__label dsp-queue__label--rear">REAR</span>
        </div>

        <div className="dsp-queue__track">
          {items.length === 0 ? (
            <p className="dsp-queue__empty">
              The queue is empty. Enqueue a value to start.
            </p>
          ) : (
            <AnimatePresence>
              {items.map((value, index) => {
                const isFront = index === 0;
                const isRear = index === items.length - 1;
                return (
                  <motion.div
                    layout
                    key={`${index}-${value}`}
                    initial={{ x: 48, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -48, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={
                      'dsp-queue__block' +
                      (isFront ? ' dsp-queue__block--front' : '') +
                      (isRear ? ' dsp-queue__block--rear' : '')
                    }
                    aria-label={`Queue item ${value}`}
                  >
                    <span className="dsp-queue__block-value">{value}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        <div className="dsp-queue__arrows">
          <span className="dsp-queue__arrow dsp-queue__arrow--out">OUT \u2190 front</span>
          <span className="dsp-queue__arrow dsp-queue__arrow--in">rear \u2192 IN</span>
        </div>
      </div>

      <div className="dsp-stats" aria-label="Queue statistics">
        <span className="dsp-stats__pill">Size · {items.length}</span>
        <span className="dsp-stats__pill">
          Front · {items.length > 0 ? items[0] : '\u2014'}
        </span>
        <span className="dsp-stats__pill">
          Rear · {items.length > 0 ? items[items.length - 1] : '\u2014'}
        </span>
      </div>

      <div className="dsp-queue__explain">
        <p className="dsp-queue__message" aria-live="polite">
          {experiment.lastMessage ?? 'Ready to experiment.'}
        </p>
        <p className="dsp-queue__detail">{explain(experiment)}</p>
        <span className="dsp-queue__fifo">FIFO · First In, First Out</span>
      </div>

      <OperationHistory history={experiment.history} onUndo={() => onAction('undo')} />
    </div>
  );
}