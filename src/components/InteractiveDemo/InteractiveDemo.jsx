import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw, Layers } from 'lucide-react';
import './InteractiveDemo.css';

const INITIAL_VALUES = [10, 20, 30];
const MAX_SIZE = 8;
const MIN_PUSH = 40;
const MAX_PUSH = 99;
const DEFAULT_STATUS = 'PUSH adds to the top · POP removes the top';

function randomValue() {
  return Math.floor(Math.random() * (MAX_PUSH - MIN_PUSH + 1)) + MIN_PUSH;
}

function toItems(values) {
  return values.map((value, index) => ({ id: index, value }));
}

const spring = { type: 'spring', stiffness: 420, damping: 32 };

export default function InteractiveDemo() {
  const [stack, setStack] = useState(() => toItems(INITIAL_VALUES));
  const nextId = useRef(INITIAL_VALUES.length);
  const [lastAction, setLastAction] = useState(DEFAULT_STATUS);

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
    nextId.current = INITIAL_VALUES.length;
    setStack(toItems(INITIAL_VALUES));
    setLastAction('Reset');
  }, []);

  const isEmpty = stack.length === 0;
  const isFull = stack.length >= MAX_SIZE;
  const topItem = stack.length > 0 ? stack[stack.length - 1] : null;

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
        <span
          className="demo__size"
          aria-label={`Stack size: ${stack.length} of ${MAX_SIZE}`}
        >
          {stack.length} / {MAX_SIZE}
        </span>
      </div>

      <div className="demo__board">
        <div className="demo__pointer-zone" aria-hidden="true">
          {topItem && (
            <motion.span
              className="demo__pointer"
              layout
              transition={spring}
            >
              TOP
            </motion.span>
          )}
        </div>

        <div className="demo__stack" aria-label="Stack contents">
          <AnimatePresence initial={false}>
            {[...stack]
              .reverse()
              .map((item, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={item.id}
                    className={
                      'demo__block' + (isTop ? ' demo__block--top' : '')
                    }
                    layout
                    initial={{ opacity: 0, y: isTop ? -70 : -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -70 }}
                    transition={spring}
                  >
                    <span className="demo__block-value">{item.value}</span>
                  </motion.div>
                );
              })}
          </AnimatePresence>

          {isEmpty && (
            <motion.p
              className="demo__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Stack is empty — try PUSH
            </motion.p>
          )}
        </div>

        <div className="demo__floor" aria-hidden="true" />
      </div>

      <div className="demo__caption">
        <p className="demo__lifo">LIFO — Last In, First Out</p>
        <p className="demo__status" aria-live="polite">
          {lastAction}
        </p>
      </div>

      <div className="demo__controls">
        <button
          className="btn btn-navy btn-control"
          onClick={push}
          disabled={isFull}
          aria-label={isFull ? 'Stack is full' : 'Push a new value onto the stack'}
        >
          <Plus size={16} />
          Push
        </button>
        <button
          className="btn btn-navy btn-control"
          onClick={pop}
          disabled={isEmpty}
          aria-label={isEmpty ? 'Stack is empty' : 'Pop the top value off the stack'}
        >
          <Minus size={16} />
          Pop
        </button>
        <button
          className="btn btn-ghost btn-control"
          onClick={reset}
          aria-label="Reset the stack to its initial state"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}
