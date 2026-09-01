import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import './QueueVisualizer.css';

const DEFAULT_VALUES = [10, 20, 30];
const MAX_SIZE = 8;
const MIN_ENQUEUE = 40;
const MAX_ENQUEUE = 99;

function randomValue() {
  return Math.floor(Math.random() * (MAX_ENQUEUE - MIN_ENQUEUE + 1)) + MIN_ENQUEUE;
}

function toItems(values) {
  return values.map((value, index) => ({ id: index, value }));
}

const spring = { type: 'spring', stiffness: 420, damping: 32 };

export default function QueueVisualizer({ concept }) {
  const initialValues = concept?.initialValues ?? DEFAULT_VALUES;
  const [queue, setQueue] = useState(() => toItems(initialValues));
  const nextId = useRef(initialValues.length);
  const [lastAction, setLastAction] = useState(
    'ENQUEUE adds to the rear \u00B7 DEQUEUE removes from the front'
  );

  const enqueue = useCallback(() => {
    if (queue.length >= MAX_SIZE) return;
    const item = { id: nextId.current++, value: randomValue() };
    setQueue((prev) => [...prev, item]);
    setLastAction(`Enqueued ${item.value}`);
  }, [queue]);

  const dequeue = useCallback(() => {
    if (queue.length === 0) return;
    const item = queue[0];
    setQueue((prev) => prev.slice(1));
    setLastAction(`Dequeued ${item.value}`);
  }, [queue]);

  const reset = useCallback(() => {
    nextId.current = initialValues.length;
    setQueue(toItems(initialValues));
    setLastAction('Reset');
  }, [initialValues]);

  const isEmpty = queue.length === 0;
  const isFull = queue.length >= MAX_SIZE;

  return (
    <div className="qviz">
      <div className="qviz__board">
        <div className="qviz__labels" aria-hidden="true">
          <span className="qviz__label qviz__label--front">FRONT</span>
          <span className="qviz__label qviz__label--rear">REAR</span>
        </div>

        <div className="qviz__track" role="group" aria-label="Queue contents">
          <AnimatePresence initial={false} mode="popLayout">
            {queue.map((item, index) => {
              const isFront = index === 0;
              const isRear = index === queue.length - 1;
              return (
                <motion.div
                  key={item.id}
                  className={
                    'qviz__block' +
                    (isFront ? ' qviz__block--front' : '') +
                    (isRear ? ' qviz__block--rear' : '')
                  }
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={spring}
                >
                  <span className="qviz__block-value">{item.value}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isEmpty && (
            <motion.p
              className="qviz__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Queue is empty &mdash; try ENQUEUE
            </motion.p>
          )}
        </div>

        <div className="qviz__arrows" aria-hidden="true">
          <span className="qviz__arrow qviz__arrow--in">
            ENQUEUE &rarr;
          </span>
          <span className="qviz__arrow qviz__arrow--out">
            &larr; DEQUEUE
          </span>
        </div>
      </div>

      <div className="qviz__caption">
        <p className="qviz__lifo">FIFO &mdash; First In, First Out</p>
        <p className="qviz__status" aria-live="polite">
          {lastAction}
        </p>
      </div>

      <div className="qviz__controls">
        <button
          type="button"
          className="btn btn-navy qviz__btn"
          onClick={enqueue}
          disabled={isFull}
          aria-label={isFull ? 'Queue is full' : 'Enqueue a new value at the rear'}
        >
          <Plus size={16} />
          Enqueue
        </button>
        <button
          type="button"
          className="btn btn-navy qviz__btn"
          onClick={dequeue}
          disabled={isEmpty}
          aria-label={isEmpty ? 'Queue is empty' : 'Dequeue the front value'}
        >
          <Minus size={16} />
          Dequeue
        </button>
        <button
          type="button"
          className="btn btn-ghost qviz__btn"
          onClick={reset}
          aria-label="Reset the queue to its initial state"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <span
        className="qviz__size"
        aria-label={`Queue size: ${queue.length} of ${MAX_SIZE}`}
      >
        {queue.length} / {MAX_SIZE}
      </span>
    </div>
  );
}
