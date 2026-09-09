import { motion, AnimatePresence } from 'framer-motion';
import { Check, SearchX } from 'lucide-react';
import './ArrayVisualization.css';

const gridTemplate = (count) => `repeat(${count}, minmax(0, 1fr))`;

const POINTER_KIND_CLASS = {
  scan: 'aviz__pointer--scan',
  min: 'aviz__pointer--min',
  key: 'aviz__pointer--key',
};

function PointerPill({ pointer, dense }) {
  return (
    <motion.span
      className={
        'aviz__pointer' +
        (POINTER_KIND_CLASS[pointer.kind] ?? ' aviz__pointer--scan') +
        (dense ? ' aviz__pointer--dense' : '')
      }
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
    >
      {pointer.label}
    </motion.span>
  );
}

function ComplexityBlock({ complexity }) {
  if (!complexity) return null;
  const entries = complexity.best
    ? [
        ['Best', complexity.best],
        ['Average', complexity.average],
        ['Worst', complexity.worst],
        ['Space', complexity.space],
      ]
    : [
        ['Time', complexity.time],
        ['Space', complexity.space],
      ];

  return (
    <ul className="aviz__complexity">
      {entries.map(([label, value]) => (
        <li className="aviz__complexity-item" key={label}>
          <span>{label} Complexity</span>
          <strong>{value}</strong>
        </li>
      ))}
    </ul>
  );
}

export default function ArrayVisualization({ complexity, snapshot }) {
  if (!snapshot) {
    return (
      <div className="aviz aviz__empty">
        <p className="aviz__empty-text">Nothing to visualize yet.</p>
      </div>
    );
  }

  const { elements, pointers = [], facts, found, notFound, sortedFlag, foundIndex } = snapshot;
  const dense = elements.length > 12;
  const huge = elements.length > 16;
  const scrollMinWidth = huge ? `${elements.length * 44}px` : undefined;
  const cols = gridTemplate(elements.length);

  const pointerSlots = pointers.reduce((slots, pointer) => {
    if (pointer.index >= 0 && pointer.index < elements.length) {
      slots[pointer.index] = [...(slots[pointer.index] ?? []), pointer];
    }
    return slots;
  }, {});

  return (
    <div className="aviz">
      <div className="aviz__stage">
        <div className={'aviz__scroll' + (huge ? ' aviz__scroll--huge' : '')}>
          <div
            className="aviz__pointers"
            style={{ gridTemplateColumns: cols, minWidth: scrollMinWidth }}
            aria-hidden="true"
          >
            {elements.map((_, index) => (
              <div className="aviz__slot" key={`pointer-${index}`}>
                {(pointerSlots[index] ?? []).map((pointer) => (
                  <PointerPill
                    key={`${pointer.label}-${index}`}
                    pointer={pointer}
                    dense={dense}
                  />
                ))}
              </div>
            ))}
          </div>

          <ol
            className={'aviz__array' + (dense ? ' aviz__array--dense' : '')}
            style={{ gridTemplateColumns: cols, minWidth: scrollMinWidth }}
          >
            {elements.map((element, index) => {
              const cellClass =
                'aviz__cell' +
                (element.state ? ` aviz__cell--${element.state}` : '');
              return (
                <li className="aviz__array-item" key={`cell-${index}`}>
                  <div
                    className={cellClass}
                    aria-label={`Index ${index}: ${element.value}${
                      element.state && element.state !== 'default'
                        ? `, ${element.state.replace(/-/g, ' ')}`
                        : ''
                    }`}
                  >
                    <span className="aviz__cell-value">{element.value}</span>
                    {found && index === foundIndex && (
                      <span className="aviz__cell-check" aria-hidden="true">
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
          className={
            'aviz__status' +
            (found || sortedFlag ? ' aviz__status--good' : '') +
            (notFound ? ' aviz__status--missing' : '')
          }
          aria-live="polite"
        >
          {snapshot.status}
        </p>

        {facts && Object.keys(facts).length > 0 && (
          <div className="aviz__facts" aria-label="Algorithm statistics">
            {Object.entries(facts).map(([label, value]) => (
              <span className="aviz__fact" key={label}>
                <span className="aviz__fact-label">{label}</span>
                <strong className="aviz__fact-value">{value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      <aside className="aviz__explain" aria-label={`Step explanation. ${snapshot.badge}`}>
        <div className="aviz__explain-head">
          <span className="aviz__current">Current Step</span>
          <span className="aviz__badge">{snapshot.badge}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={snapshot.key}
            className="aviz__copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <h3 className="aviz__text">{snapshot.heading}</h3>
            <p className="aviz__detail">{snapshot.detail}</p>
            {found && (
              <motion.p
                className="aviz__result aviz__result--found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Check size={16} strokeWidth={2.5} />
                Found
                {typeof foundIndex === 'number' ? ` \u00B7 index ${foundIndex}` : ''}
              </motion.p>
            )}
            {notFound && (
              <motion.p
                className="aviz__result aviz__result--missing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <SearchX size={16} strokeWidth={2.5} />
                Not found
              </motion.p>
            )}
            {sortedFlag && (
              <motion.p
                className="aviz__result aviz__result--found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Check size={16} strokeWidth={2.5} />
                Array sorted
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <ComplexityBlock complexity={complexity} />
      </aside>
    </div>
  );
}