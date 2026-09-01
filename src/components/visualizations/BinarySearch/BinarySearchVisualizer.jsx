import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Check, ChevronDown } from 'lucide-react';
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
  config,
  complexity,
  step,
  total,
  snapshot,
  onNext,
  onPrev,
  onReset,
}) {
  const { array, target } = config;
  const pointerLow = snapshot ? snapshot.low : 0;
  const pointerHigh = snapshot ? snapshot.high : array.length - 1;
  const pointerMid = snapshot ? snapshot.mid : null;
  const found = Boolean(snapshot?.found);

  return (
    <section
      className="cviz"
      aria-label="Binary search demonstration"
    >
      <div className="cviz__main">
        <header className="cviz__header">
          <div className="cviz__title-wrap">
            <h3 className="cviz__title">Binary Search</h3>
            <p className="cviz__sub">
              Sorted array [{array[0]} \u2026 {array[array.length - 1]}] \u00B7 Target {target}
            </p>
          </div>
          <div className="cviz__progress-wrap">
            <span className="cviz__progress" aria-live="polite">
              STEP {step} / {total}
            </span>
            <div className="cviz__dots" role="img" aria-label={`Step ${step} of ${total}`}>
              {Array.from({ length: total }, (_, index) => (
                <span
                  key={index}
                  className={
                    'cviz__dot' +
                    (index + 1 === step ? ' cviz__dot--current' : '') +
                    (index + 1 < step ? ' cviz__dot--done' : '') +
                    (found && index + 1 === step ? ' cviz__dot--found' : '')
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </header>

        <div
          className="cviz__board"
          role="group"
          aria-label={`Binary search visualization. Array values ${array.join(
            ', '
          )}. Target value ${target}.`}
        >
          <div className="cviz__pointers" aria-hidden="true">
            {array.map((_, index) => (
              <div className="cviz__slot" key={`pointer-${index}`}>
                {pointerMid === index && (
                  <motion.span
                    layout
                    transition={spring}
                    className={
                      'cviz__pointer cviz__pointer--mid' +
                      (found ? ' cviz__pointer--found' : '')
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
                    className="cviz__pointer cviz__pointer--low"
                  >
                    LOW
                    <ChevronDown size={13} strokeWidth={2.5} />
                  </motion.span>
                )}
                {pointerHigh === index && pointerHigh !== pointerMid && (
                  <motion.span
                    layout
                    transition={spring}
                    className="cviz__pointer cviz__pointer--high"
                  >
                    HIGH
                    <ChevronDown size={13} strokeWidth={2.5} />
                  </motion.span>
                )}
              </div>
            ))}
          </div>

          <motion.ol
            className="cviz__array"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={arrayVariants}
          >
            {array.map((value, index) => {
              const eliminated = Boolean(snapshot?.eliminated?.[index]);
              const isMid = pointerMid === index;
              const foundCell = found && isMid;

              return (
                <motion.li className="cviz__array-item" key={index} variants={cellVariants}>
                  <motion.div
                    className={
                      'cviz__cell' +
                      (eliminated ? ' cviz__cell--elim' : '') +
                      (isMid && !foundCell ? ' cviz__cell--mid' : '') +
                      (foundCell ? ' cviz__cell--found' : '')
                    }
                    initial={false}
                    animate={
                      eliminated ? { opacity: 0.3, scale: 0.94 } : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <span className="cviz__cell-value">{value}</span>
                    {foundCell && (
                      <motion.span
                        className="cviz__cell-check"
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
            className={'cviz__status' + (found ? ' cviz__status--found' : '')}
            aria-live="polite"
          >
            {snapshot ? snapshot.status : ''}
          </p>
        </div>

        <div className="cviz__controls">
          <button
            type="button"
            className="btn btn-navy cviz__btn"
            onClick={onPrev}
            disabled={step === 1}
            aria-label="Go to the previous step"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <span className="cviz__step" aria-hidden="true">
            Step {step} / {total}
          </span>

          <button
            type="button"
            className="btn btn-gold cviz__btn"
            onClick={onNext}
            disabled={step === total}
            aria-label="Go to the next step"
          >
            Next Step
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className="btn btn-ghost cviz__btn cviz__reset"
            onClick={onReset}
            aria-label="Reset the search to step 1"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <aside className="cviz__explain" aria-label={`Step explanation. ${snapshot?.badge}`}>
        <div className="cviz__explain-head">
          <span className="cviz__current">Current Step</span>
          <span className="cviz__badge">{snapshot?.badge}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={snapshot?.key}
            className="cviz__copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <h3 className="cviz__text">{snapshot?.heading}</h3>
            <p className="cviz__detail">{snapshot?.detail}</p>
            {found && (
              <motion.p
                className="cviz__found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Check size={16} strokeWidth={2.5} />
                Found {target}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <ul className="cviz__complexity">
          <li className="cviz__complexity-item">
            <span>Time Complexity</span>
            <strong>{complexity.time}</strong>
          </li>
          <li className="cviz__complexity-item">
            <span>Space Complexity</span>
            <strong>{complexity.space}</strong>
          </li>
        </ul>
      </aside>
    </section>
  );
}
