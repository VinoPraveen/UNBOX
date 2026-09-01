import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, SearchX } from 'lucide-react';
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

const gridTemplate = (count) => `repeat(${count}, minmax(0, 1fr))`;

export default function BinarySearchVisualizer({
  config,
  complexity,
  snapshot,
}) {
  const { array, target } = config;
  const pointerLow = snapshot ? snapshot.low : 0;
  const pointerHigh = snapshot ? snapshot.high : array.length - 1;
  const pointerMid = snapshot ? snapshot.mid : null;
  const found = Boolean(snapshot?.found);
  const notFound = Boolean(snapshot?.notFound);
  const showFacts = snapshot?.comparisonCount !== undefined;
  const dense = array.length > 12;

  return (
    <div className="cviz">
      <div className="cviz__board">
        <div
          className="cviz__pointers"
          style={{ gridTemplateColumns: gridTemplate(array.length) }}
          aria-hidden="true"
        >
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
          className={'cviz__array' + (dense ? ' cviz__array--dense' : '')}
          style={{ gridTemplateColumns: gridTemplate(array.length) }}
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

        {showFacts && (
          <div className="cviz__facts" aria-label="Experiment statistics">
            <span className="cviz__fact">
              <span className="cviz__fact-label">Comparisons</span>
              <strong className="cviz__fact-value">{snapshot.comparisonCount}</strong>
            </span>
            <span className="cviz__fact">
              <span className="cviz__fact-label">Range</span>
              <strong className="cviz__fact-value">
                {notFound ? 'empty' : `${snapshot.low} \u2192 ${snapshot.high}`}
              </strong>
            </span>
          </div>
        )}
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
            {notFound && (
              <motion.p
                className="cviz__not-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <SearchX size={16} strokeWidth={2.5} />
                Not found {target}
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
    </div>
  );
}