import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import './StackVisualizer.css';

const DEFAULT_VALUES = [10, 20, 30];
const MAX_SIZE = 8;
const MIN_PUSH = 40;
const MAX_PUSH = 99;

function randomValue() {
  return Math.floor(Math.random() * (MAX_PUSH - MIN_PUSH + 1)) + MIN_PUSH;
}

function toItems(values) {
  return values.map((value, index) => ({ id: index, value }));
}

const spring = { type: 'spring', stiffness: 420, damping: 32 };

export default function StackVisualizer({ concept }) {
  const initialValues = concept?.initialValues ?? DEFAULT_VALUES;
  const [stack, setStack] = useState(() => toItems(initialValues));
  const nextId = useRef(initialValues.length);
  const [lastAction, setLastAction] = useState('PUSH adds to the top \u00B7 POP removes the top');

  const push = useCallback(() => {
    if (stack.length >= MAX_SIZE) return;
    const item = { id: nextId.current++, value: randomValue() };
    setStack((prev) => [...prev, item]);
    setLastAction(`Pushed ${item.value}`);
  }, [stack]);

  const pop = useCallback(() => {
    if (stack.length === 0) return;
    const item = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    setLastAction(`Popped ${item.value}`);
  }, [stack]);

  const reset = useCallback(() => {
    nextId.current = initialValues.length;
    setStack(toItems(initialValues));
    setLastAction('Reset');
  }, [initialValues]);

  const isEmpty = stack.length === 0;
  const isFull = stack.length >= MAX_SIZE;
  const topItem = stack.length > 0 ? stack[stack.length - 1] : null;

  return (
    <div className="sviz">
      <div className="sviz__board">
        <div className="sviz__pointer-zone" aria-hidden="true">
          {topItem && (
            <motion.span
              className="sviz__pointer"
              layout
              transition={spring}
            >
              TOP
            </motion.span>
          )}
        </div>

        <div className="sviz__stack" role="group" aria-label="Stack contents">
          <AnimatePresence initial={false}>
            {[...stack]
              .reverse()
              .map((item, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={item.id}
                    className={
                      'sviz__block' + (isTop ? ' sviz__block--top' : '')
                    }
                    layout
                    initial={{ opacity: 0, y: isTop ? -70 : -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -70 }}
                    transition={spring}
                  >
                    <span className="sviz__block-value">{item.value}</span>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {isEmpty && (
            <motion.p
              className="sviz__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Stack is empty &mdash; try PUSH
            </motion.p>
          )}
        </div>

        <div className="sviz__floor" aria-hidden="true" />
      </div>

      <div className="sviz__caption">
        <p className="sviz__lifo">LIFO &mdash; Last In, First Out</p>
        <p className="sviz__status" aria-live="polite">
          {lastAction}
        </p>
      </div>

      <div className="sviz__controls">
        <button
          type="button"
          className="btn btn-navy sviz__btn"
          onClick={push}
          disabled={isFull}
          aria-label={isFull ? 'Stack is full' : 'Push a new value onto the stack'}
        >
          <Plus size={16} />
          Push
        </button>
        <button
          type="button"
          className="btn btn-navy sviz__btn"
          onClick={pop}
          disabled={isEmpty}
          aria-label={isEmpty ? 'Stack is empty' : 'Pop the top value off the stack'}
        >
          <Minus size={16} />
          Pop
        </button>
        <button
          type="button"
          className="btn btn-ghost sviz__btn"
          onClick={reset}
          aria-label="Reset the stack to its initial state"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <span
        className="sviz__size"
        aria-label={`Stack size: ${stack.length} of ${MAX_SIZE}`}
      >
        {stack.length} / {MAX_SIZE}
      </span>
    </div>
  );
}
