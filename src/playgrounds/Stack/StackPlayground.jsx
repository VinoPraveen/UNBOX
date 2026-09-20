import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import OperationHistory from '../../components/playground/OperationHistory/OperationHistory.jsx';
import './StackPlayground.css';

const ACTION_COPY = {
  push: 'Push places a value on top of the stack. The newest value is always the first one removed.',
  pop: 'Pop removes the top value. The value below it becomes the new top.',
  peek: 'Peek reads the top value without removing it.',
  clear: 'Clear empties the stack and resets it to its starting state.',
  undo: 'Undo restores the stack to its state before the last operation.',
  underflow: 'The stack is empty, so there is nothing to pop. Push a value first.',
};

function explain(experiment) {
  const meta = experiment.meta ?? {};
  let body = ACTION_COPY[meta.action] ?? ACTION_COPY.push;
  if (meta.action === 'push' && meta.value !== undefined) {
    body = `${meta.value} was placed on top of the stack. It will be the first value removed.`;
  }
  if (meta.action === 'pop' && meta.value !== undefined) {
    body = `The top value ${meta.value} was removed. The stack below is unchanged.`;
  }
  if (meta.action === 'peek' && meta.value !== undefined) {
    body = `The top value is ${meta.value}. Peek leaves it on the stack.`;
  }
  return body;
}

export default function StackPlayground({ experiment, onAction }) {
  if (!experiment) {
    return (
      <div className="dsp-idle">
        <Layers size={28} aria-hidden="true" />
        <p className="dsp-idle__title">Ready to experiment.</p>
        <p className="dsp-idle__text">
          Enter a value, then press Push to place it on top of the stack.
        </p>
      </div>
    );
  }

  const items = experiment.items ?? [];
  const top = items.length > 0 ? items[items.length - 1] : null;
  const action = experiment.meta?.action;

  return (
    <div className="dsp-stack">
      <div className="dsp-stack__board">
        <div className="dsp-stack__pointer-zone">
          {items.length > 0 ? (
            <span className="dsp-stack__pointer">TOP</span>
          ) : null}
        </div>

        <div className="dsp-stack__stack">
          {items.length === 0 ? (
            <p className="dsp-stack__empty">
              The stack is empty. Push a value to start.
            </p>
          ) : (
            <AnimatePresence>
              {items.map((value, index) => {
                const isTop = index === items.length - 1;
                const isPeeked = action === 'peek' && isTop;
                return (
                  <motion.div
                    layout
                    key={`${index}-${value}`}
                    initial={{ y: -70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -70, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={
                      'dsp-stack__block' +
                      (isTop ? ' dsp-stack__block--top' : '') +
                      (isPeeked ? ' dsp-stack__block--peek' : '')
                    }
                    aria-label={`Stack item ${value}`}
                  >
                    <span className="dsp-stack__block-value">{value}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        <div className="dsp-stack__floor" aria-hidden="true" />
      </div>

      <div className="dsp-stats" aria-label="Stack statistics">
        <span className="dsp-stats__pill">Size · {items.length}</span>
        <span className="dsp-stats__pill">Top · {top ?? '\u2014'}</span>
      </div>

      <div className="dsp-stack__explain">
        <p className="dsp-stack__message" aria-live="polite">
          {experiment.lastMessage ?? 'Ready to experiment.'}
        </p>
        <p className="dsp-stack__detail">{explain(experiment)}</p>
        <span className="dsp-stack__lifo">LIFO · Last In, First Out</span>
      </div>

      <OperationHistory history={experiment.history} onUndo={() => onAction('undo')} />
    </div>
  );
}