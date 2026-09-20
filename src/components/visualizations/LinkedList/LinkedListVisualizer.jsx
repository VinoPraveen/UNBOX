import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, RotateCcw } from 'lucide-react';
import { rebuildLinkedList } from '../../../dataStructures/linkedList.js';
import '../../../playgrounds/LinkedList/LinkedListPlayground.css';
import './LinkedListVisualizer.css';

const DEFAULT_VALUES = [10, 20, 30];
const MIN_VALUE = 40;
const MAX_VALUE = 99;

function randomValue() {
  return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
}

function nodeClasses(index, meta) {
  const classes = ['dsp-node'];
  if (!meta) return classes.join(' ');
  const trail = meta.trail ?? [];
  if (meta.found && index === meta.index) {
    classes.push('dsp-node--found');
  } else if (trail.includes(index)) {
    classes.push('dsp-node--visited');
  }
  return classes.join(' ');
}

function walkDelay(index, meta) {
  if (!meta) return undefined;
  const trail = meta.trail ?? [];
  const position = trail.indexOf(index);
  if (meta.found && index === meta.index) {
    return { transitionDelay: `${trail.length * 0.05}s` };
  }
  if (position === -1) return undefined;
  return { transitionDelay: `${position * 0.05}s` };
}

export default function LinkedListVisualizer({ concept }) {
  const initialValues = concept?.initialValues ?? DEFAULT_VALUES;
  const [items, setItems] = useState(() => initialValues.slice());
  const [lastAction, setLastAction] = useState(
    'INSERT adds a node \u00B7 SEARCH follows NEXT'
  );
  const [meta, setMeta] = useState(null);

  const insertBeginning = useCallback(() => {
    const list = rebuildLinkedList(items);
    list.insertAtBeginning(randomValue());
    setItems(list.toArray());
    setMeta(null);
    setLastAction(`Inserted ${list.headValue} at HEAD`);
  }, [items]);

  const insertEnd = useCallback(() => {
    const list = rebuildLinkedList(items);
    list.insertAtEnd(randomValue());
    setItems(list.toArray());
    setMeta(null);
    setLastAction(`Inserted ${list.tailValue} at TAIL`);
  }, [items]);

  const search = useCallback(() => {
    if (items.length === 0) {
      setLastAction('The list is empty.');
      setMeta(null);
      return;
    }
    const list = rebuildLinkedList(items);
    const target = items[Math.floor(items.length / 2)];
    const result = list.search(target);
    setMeta({
      found: result.found,
      index: result.index,
      trail: result.trail.map((node) => node.index),
    });
    setLastAction(
      `Found ${target} at node ${result.index} (${result.comparisons} comparisons)`
    );
  }, [items]);

  const reset = useCallback(() => {
    setItems(initialValues.slice());
    setMeta(null);
    setLastAction('Reset');
  }, [initialValues]);

  return (
    <div className="lviz">
      <div className="dsp-list__board">
        <div className="dsp-list__scroll">
          <ol className="dsp-list__track">
            <AnimatePresence>
              {items.length === 0 ? (
                <li className="dsp-list__empty" key="empty">
                  The list is empty &mdash; try an insert.
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
                        className={nodeClasses(index, meta)}
                        style={walkDelay(index, meta)}
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

      <div className="lviz__caption">
        <p className="lviz__motto">Nodes connected through references.</p>
        <p className="lviz__status" aria-live="polite">
          {lastAction}
        </p>
      </div>

      <div className="lviz__controls">
        <button
          type="button"
          className="btn btn-navy lviz__btn"
          onClick={insertBeginning}
          aria-label="Insert a new node at the head"
        >
          <Plus size={16} />
          Insert Beginning
        </button>
        <button
          type="button"
          className="btn btn-navy lviz__btn"
          onClick={insertEnd}
          aria-label="Insert a new node at the tail"
        >
          <Plus size={16} />
          Insert End
        </button>
        <button
          type="button"
          className="btn btn-ghost lviz__btn"
          onClick={search}
          disabled={items.length === 0}
          aria-label={items.length === 0 ? 'List is empty' : 'Search the list'}
        >
          <Search size={16} />
          Search
        </button>
        <button
          type="button"
          className="btn btn-ghost lviz__btn"
          onClick={reset}
          aria-label="Reset the list to its initial state"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <span className="lviz__size" aria-label={`List size: ${items.length} nodes`}>
        Size · {items.length}
      </span>
    </div>
  );
}