import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import '../Array/ArrayVisualization.css';
import './QuickSortVisualizer.css';

const gridTemplate = (count) => `repeat(${count}, minmax(0, 1fr))`;

const QUICK_PHASES = [
  ['choose', 'PIVOT'],
  ['partition', 'PARTITION'],
  ['place', 'PLACE'],
];

const POINTER_KIND_CLASS = {
  pivot: 'qksv__pointer--pivot',
  part: 'qksv__pointer--part',
  scan: 'qksv__pointer--scan',
};

function PointerPill({ pointer, dense }) {
  return (
    <motion.span
      className={
        'aviz__pointer' +
        ' ' +
        (POINTER_KIND_CLASS[pointer.kind] ?? 'aviz__pointer--scan') +
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
  const entries = [
    ['Best', complexity.best],
    ['Average', complexity.average],
    ['Worst', complexity.worst],
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

function rangeCopy(snapshot, n) {
  const { phase, region, pivotIndex } = snapshot;
  if (!region) return `Array of ${n} elements`;
  if (phase === 'place' && Number.isFinite(pivotIndex)) {
    return `Pivot @ ${pivotIndex} \u00B7 left [${region.lo}\u2013${pivotIndex - 1}] \u00B7 right [${pivotIndex + 1}\u2013${region.hi}]`;
  }
  if (phase === 'choose' || phase === 'partition') {
    return `Span [${region.lo}\u2013${region.hi}]\u00B7pivot @ ${pivotIndex}`;
  }
  return `Range [${region.lo}\u2013${region.hi}]`;
}

export default function QuickSortVisualizer({ complexity, snapshot }) {
  if (!snapshot) {
    return (
      <div className="aviz aviz__empty">
        <p className="aviz__empty-text">Nothing to visualize yet.</p>
      </div>
    );
  }

  const { elements, pointers = [], facts, sortedFlag } = snapshot;
  const n = elements.length;
  const dense = n > 12;
  const huge = n > 16;
  const scrollMinWidth = huge ? `${n * 44}px` : undefined;
  const cols = gridTemplate(n);
  const dividers = snapshot.dividers ?? [];

  const pointerSlots = pointers.reduce((slots, pointer) => {
    if (pointer.index >= 0 && pointer.index < n) {
      slots[pointer.index] = [...(slots[pointer.index] ?? []), pointer];
    }
    return slots;
  }, {});

  const cutLabel = snapshot.phase === 'place' ? 'PIVOT' : null;

  return (
    <div className="aviz">
      <div className="aviz__stage">
        <div className="qksv__context" aria-label="Quick sort context">
          <div className="qksv__pipeline" role="group" aria-label="Quick sort phase">
            {QUICK_PHASES.map(([key, label]) => (
              <span
                key={key}
                className={'qksv__phase' + (snapshot.phase === key ? ' qksv__phase--active' : '')}
              >
                {label}
              </span>
            ))}
          </div>
          <span className="qksv__range">{rangeCopy(snapshot, n)}</span>
        </div>

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
                (element.state ? ` aviz__cell--${element.state}` : '') +
                (dividers.includes(index) ? ' aviz__cell--cut' : '');
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
                  </div>
                </li>
              );
            })}
          </ol>
          {cutLabel && (
            <div className="qksv__tags" aria-hidden="true">
              {dividers.map((index) => (
                <span className="qksv__tag" key={`cut-${index}`}>
                  {cutLabel}
                </span>
              ))}
            </div>
          )}
        </div>

        <p
          className={'aviz__status' + (sortedFlag ? ' aviz__status--good' : '')}
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