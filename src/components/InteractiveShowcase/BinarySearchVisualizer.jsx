import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { ARRAY, TARGET } from './binarySearchSteps.js';
import './BinarySearchVisualizer.css';

const spring = { type: 'spring', stiffness: 320, damping: 28 };

const arrayVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export default function BinarySearchVisualizer({
  step,
  total,
  snapshot,
  onNext,
  onPrev,
  onReset,
}) {
  const pointerLow = snapshot ? snapshot.low : 0;
  const pointerHigh = snapshot ? snapshot.high : ARRAY.length - 1;
  const pointerMid = snapshot ? snapshot.mid : null;
  const found = Boolean(snapshot?.found);

  return (
    <section className="bsearch" aria-label="Binary search demonstration">
      <header className="bsearch__header">
        <div className="bsearch__title-wrap">
          <h3 className="bsearch__title">Binary Search</h3>
          <p className="bsearch__sub">Sorted array [10 … 70] · Target {TARGET}</p>
        </div>
        <div className="bsearch__progress-wrap">
          <span className="bsearch__progress" aria-live="polite">
            STEP {step} / {total}
          </span>
          <div className="bsearch__dots" role="img" aria-label={`Step ${step} of ${total}`}>
            {Array.from({ length: total }, (_, index) => (
              <span
                key={index}
                className={
                  'bsearch__dot' +
                  (index + 1 === step ? ' bsearch__dot--current' : '') +
                  (index + 1 < step ? ' bsearch__dot--done' : '') +
                  (found && index + 1 === step ? ' bsearch__dot--found' : '')
                }
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </header>

      <div
        className="bsearch__board"
        role="group"
        aria-label={`Binary search visualization. Array values ${ARRAY.join(', ')}. Target value ${TARGET}.`}
      >
        <div className="bsearch__pointers" aria-hidden="true">
          {ARRAY.map((_, index) => (
            <div className="bsearch__slot" key={`pointer-${index}`}>
              {pointerMid === index && (
                <motion.span
                  layout
                  transition={spring}
                  className={
                    'bsearch__pointer bsearch__pointer--mid' +
                    (found ? ' bsearch__pointer--found' : '')
                  }
                >
                  MID
                  <ChevronDown size={13} strokeWidth={2.5} />
                </motion.span>
              )}
              {pointerLow === index && pointerLow !== pointerMid && (
                <motion.span
                  layout
                  transition={spring}
                  className="bsearch__pointer bsearch__pointer--low"
                >
                  LOW
                  <ChevronDown size={13} strokeWidth={2.5} />
                </motion.span>
              )}
              {pointerHigh === index && pointerHigh !== pointerMid && (
                <motion.span
                  layout
                  transition={spring}
                  className="bsearch__pointer bsearch__pointer--high"
                >
                  HIGH
                  <ChevronDown size={13} strokeWidth={2.5} />
                </motion.span>
              )}
            </div>
          ))}
        </div>

        <motion.ol
          className="bsearch__array"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={arrayVariants}
        >
          {ARRAY.map((value, index) => {
            const eliminated = Boolean(snapshot?.eliminated?.[index]);
            const isMid = pointerMid === index;
            const foundCell = found && isMid;

            return (
              <motion.li className="bsearch__array-item" key={index} variants={cellVariants}>
                <motion.div
                  className={
                    'bsearch__cell' +
                    (eliminated ? ' bsearch__cell--elim' : '') +
                    (isMid && !foundCell ? ' bsearch__cell--mid' : '') +
                    (foundCell ? ' bsearch__cell--found' : '')
                  }
                  initial={false}
                  animate={
                    eliminated
                      ? { opacity: 0.3, scale: 0.94 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <span className="bsearch__cell-value">{value}</span>
                  {foundCell && (
                    <motion.span
                      className="bsearch__cell-check"
                      aria-hidden="true"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </motion.span>
                  )}
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ol>

        <p
          className={'bsearch__status' + (found ? ' bsearch__status--found' : '')}
          aria-live="polite"
        >
          {snapshot ? snapshot.status : ''}
        </p>
      </div>

      <div className="bsearch__controls">
        <button
          type="button"
          className="btn btn-navy btn-control"
          onClick={onPrev}
          disabled={step === 1}
          aria-label="Go to the previous step"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <span className="bsearch__step" aria-hidden="true">
          Step {step} / {total}
        </span>

        <button
          type="button"
          className="btn btn-gold btn-control"
          onClick={onNext}
          disabled={step === total}
          aria-label="Go to the next step"
        >
          Next Step
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-control bsearch__reset"
          onClick={onReset}
          aria-label="Reset the search to step 1"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </section>
  );
}