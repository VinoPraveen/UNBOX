import { motion, AnimatePresence } from 'framer-motion';
import { Link2 } from 'lucide-react';
import OperationHistory from '../../components/playground/OperationHistory/OperationHistory.jsx';
import './LinkedListPlayground.css';

const ACTION_COPY = {
  'insert-beginning':
    'Insert at Beginning adds a new head node. The old head becomes the second node.',
  'insert-end': 'Insert at End adds a new tail node after the current last node.',
  'insert-index':
    'Insert at Index places the value at a specific position. The previous node\u2019s NEXT reference updates to point to the new node.',
  delete:
    'Delete by Value removes the first node holding that value. Its predecessor now points to its successor.',
  search:
    'Search walks the nodes one by one, following NEXT until it finds the value or reaches NULL.',
  clear: 'Clear removes every node and resets HEAD to NULL.',
  undo: 'Undo restores the list to its state before the last operation.',
  'not-found': 'No node in the list held that value. The search reached NULL.',
};

function explain(experiment) {
  const meta = experiment.meta ?? {};
  const fallback = ACTION_COPY[meta.action] ?? ACTION_COPY['insert-beginning'];
  if (meta.action === 'delete' && meta.value !== undefined) {
    return `${meta.value} was removed from the list. The nodes around it are now linked directly.`;
  }
  if (meta.action === 'search') {
    if (meta.found) {
      return `Found ${meta.value} at node ${meta.index} after ${meta.comparisons} comparisons.`;
    }
    return `Searched ${meta.comparisons} node${meta.comparisons === 1 ? '' : 's'} and reached NULL. ${meta.value} is not in the list.`;
  }
  return fallback;
}

function nodeClasses(value, index, meta) {
  const classes = ['dsp-node'];
  if (!meta) return classes.join(' ');
  if (meta.action === 'search') {
    const trailIndex = meta.trail ?? [];
    if (index === meta.index) {
      if (meta.found) classes.push('dsp-node--found');
      else classes.push('dsp-node--visited');
    } else if (trailIndex.includes(index)) {
      classes.push('dsp-node--visited');
    }
  }
  if (meta.action === 'insert' && index === meta.index) {
    classes.push('dsp-node--inserted');
  }
  if (meta.action === 'delete' && index === meta.index) {
    classes.push('dsp-node--deleted');
  }
  return classes.join(' ');
}

function walkDelay(value, index, meta) {
  if (!meta || meta.action !== 'search') return undefined;
  const trailIndex = meta.trail ?? [];
  if (meta.found && index === meta.index) {
    return { transitionDelay: `${trailIndex.length * 0.05}s` };
  }
  const position = trailIndex.indexOf(index);
  if (position === -1) return undefined;
  return { transitionDelay: `${position * 0.05}s` };
}

export default function LinkedListPlayground({ experiment, onAction }) {
  if (!experiment) {
    return (
      <div className="dsp-idle">
        <Link2 size={28} aria-hidden="true" />
        <p className="dsp-idle__title">Ready to experiment.</p>
        <p className="dsp-idle__text">
          Enter a value, then insert it into the list to see the nodes connect.
        </p>
      </div>
    );
  }

  const items = experiment.items ?? [];
  const meta = experiment.meta ?? {};
  const comparisons =
    meta.action === 'search' && meta.comparisons !== undefined
      ? meta.comparisons
      : null;

  return (
    <div className="dsp-list">
      <div className="dsp-list__board">
        <div className="dsp-list__scroll">
          <ol className="dsp-list__track">
            <AnimatePresence>
              {items.length === 0 ? (
                <li className="dsp-list__empty" key="empty">
                  The list is empty. Insert a value to start.
                </li>
              ) : (
                items.map((value, index) => {
                  const isHead = index === 0;
                  const isTail = index === items.length - 1;
                  return (
                    <li className="dsp-list__cell" key={`${index}-${value}`}>
                      <span
                        className={
                          'dsp-node__tag' +
                          (isHead ? ' dsp-node__tag--head' : '') +
                          (isTail ? ' dsp-node__tag--tail' : '')
                        }
                      >
                        {isHead ? 'HEAD' : isTail ? 'TAIL' : ''}
                      </span>
                      <motion.div
                        layout
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className={nodeClasses(value, index, meta)}
                        style={walkDelay(value, index, meta)}
                        aria-label={`Node ${index}, value ${value}`}
                      >
                        <span className="dsp-node__value">{value}</span>
                        <span className="dsp-node__pointer" aria-hidden="true">
                          {isTail ? '' : '\u2192'}
                        </span>
                      </motion.div>
                    </li>
                  );
                })
              )}
            </AnimatePresence>
            <li className="dsp-list__cell dsp-list__cell--null" key="null">
              <span className="dsp-node__tag" aria-hidden="true" />
              <span className="dsp-null">NULL</span>
            </li>
          </ol>
        </div>

        <div className="dsp-list__legend">
          <span className="dsp-list__legend-item">
            <span className="dsp-list__swatch dsp-list__swatch--head">HEAD</span>
            first node
          </span>
          <span className="dsp-list__legend-item">
            <span className="dsp-list__swatch dsp-list__swatch--arrow">\u2192</span>
            NEXT reference
          </span>
          <span className="dsp-list__legend-item">
            <span className="dsp-list__swatch dsp-list__swatch--null">NULL</span>
            end of list
          </span>
        </div>
      </div>

      <div className="dsp-stats" aria-label="Linked list statistics">
        <span className="dsp-stats__pill">Size · {items.length}</span>
        <span className="dsp-stats__pill">
          Head · {items.length > 0 ? items[0] : '\u2014'}
        </span>
        <span className="dsp-stats__pill">
          Tail · {items.length > 0 ? items[items.length - 1] : '\u2014'}
        </span>
        {comparisons !== null ? (
          <span className="dsp-stats__pill">Comparisons · {comparisons}</span>
        ) : null}
      </div>

      <div className="dsp-list__explain">
        <p className="dsp-list__message" aria-live="polite">
          {experiment.lastMessage ?? 'Ready to experiment.'}
        </p>
        <p className="dsp-list__detail">{explain(experiment)}</p>
        <span className="dsp-list__motto">Nodes connected through references.</span>
      </div>

      <OperationHistory history={experiment.history} onUndo={() => onAction('undo')} />
    </div>
  );
}