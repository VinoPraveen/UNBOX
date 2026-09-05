import { motion, AnimatePresence } from 'framer-motion';
import { Check, SearchX } from 'lucide-react';
import './BinarySearchVisualizer.css';

const gridTemplate = (count) => `repeat(${count}, minmax(0, 1fr))`;

function PointerLabel({ label, className, id }) {
  return (
    <motion.span
      layoutId={id}
      className={`cviz__pointer ${className}`}
      layout
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      {label}
    </motion.span>
  );
}

export default function BinarySearchVisualizer({ config, complexity, snapshot }) {
  const { array, target } = config;
  const dense = array.length > 12;
  const huge = array.length > 16;
  const scrollMinWidth = huge ? `${array.length * 44}px` : undefined;

  const pointerLow = snapshot ? snapshot.low : 0;
  const pointerHigh = snapshot ? snapshot.high : array.length - 1;
  const pointerMid = snapshot ? snapshot.mid : null;
  const found = Boolean(snapshot?.found);
  const notFound = Boolean(snapshot?.notFound);
  const showFacts = snapshot?.comparisonCount !== undefined;
  const cols = gridTemplate(array.length);

  const pointerGlyphs = array.map((_, index) => {
    const isLow = pointerLow === index;
    const isHigh = pointerHigh === index;
    const isMid = pointerMid === index;

    const items = [];
    if (isMid) {
      items.push(
        <PointerLabel
          key="mid"
          id="cviz-ptr-mid"
          label="MID"
          className={'cviz__pointer--mid' + (found ? ' cviz__pointer--found' : '')}
        />
      );
    }
    if (isLow && !isMid) {
      items.push(
        <PointerLabel key="low" id="cviz-ptr-low" label="LOW" className="cviz__pointer--low" />
      );
    }
    if (isHigh && !isMid) {
      items.push(
        <PointerLabel
          key="high"
          id="cviz-ptr-high"
          label="HIGH"
          className="cviz__pointer--high"
        />
      );
    }
    return items.length ? items : null;
  });

  return (
    <div className="cviz">
      <div className="cviz__stage">
        <div className={'cviz__scroll' + (huge ? ' cviz__scroll--huge' : '')}>
          <div
            className="cviz__pointers"
            style={{ gridTemplateColumns: cols, minWidth: scrollMinWidth }}
            aria-hidden="true"
          >
            {pointerGlyphs.map((glyphs, index) => (
              <div className="cviz__slot" key={`pointer-${index}`}>
                {glyphs}
              </div>
            ))}
          </div>

          <ol
            className={'cviz__array' + (dense ? ' cviz__array--dense' : '')}
            style={{ gridTemplateColumns: cols, minWidth: scrollMinWidth }}
          >
            {array.map((value, index) => {
              const eliminated = Boolean(snapshot?.eliminated?.[index]);
              const isMid = pointerMid === index;
              const foundCell = found && isMid;

              const cellClass =
                'cviz__cell' +
                (eliminated ? ' cviz__cell--elim' : ' cviz__cell--range') +
                (isMid && !foundCell ? ' cviz__cell--mid' : '') +
                (foundCell ? ' cviz__cell--found' : '');

              return (
                <li className="cviz__array-item" key={`cell-${index}`}>
                  <div className={cellClass}>
                    <span className="cviz__cell-value">{value}</span>
                    {foundCell && (
                      <span className="cviz__cell-check" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

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