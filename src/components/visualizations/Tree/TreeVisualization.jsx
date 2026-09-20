import { motion, AnimatePresence } from 'framer-motion';
import { Check, SearchX } from 'lucide-react';
import './TreeVisualization.css';

const NODE_W = 52;
const H_GAP = 64;
const V_GAP = 84;
const PAD = 32;

function nodeState(snapshot, node) {
  if (!snapshot) return '';
  if (snapshot.currentId === node.id) {
    if (snapshot.phase === 'found') return ' tree-node--found';
    if (snapshot.phase === 'miss') return ' tree-node--miss';
    return ' tree-node--current';
  }
  if ((snapshot.pathIds ?? []).includes(node.id)) return ' tree-node--path';
  if ((snapshot.visitedIds ?? []).includes(node.id)) return ' tree-node--visited';
  return '';
}

function tagFor(snapshot, node) {
  if (node.isRoot) return 'ROOT';
  if (node.isLeaf) return 'LEAF';
  if (snapshot && snapshot.currentId === node.id) return 'CURRENT';
  return '';
}

export default function TreeVisualization({ config, complexity, snapshot }) {
  const tree = snapshot?.tree ?? { nodes: [], rootId: null, width: 0, height: 0 };
  const nodes = tree.nodes ?? [];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const boardWidth = Math.max(nodes.length, 1) * H_GAP + PAD * 2;
  const boardHeight = Math.max(tree.height, 1) * V_GAP + PAD * 2 + 24;

  const pos = (node) => ({
    x: PAD + node.x * H_GAP + NODE_W / 2,
    y: PAD + node.depth * V_GAP + 26,
  });

  const result = snapshot?.result ?? [];
  const complete = Boolean(snapshot?.complete);
  const foundPhase = snapshot?.phase === 'found';
  const missPhase = snapshot?.phase === 'miss' || snapshot?.notFound;

  return (
    <div className="treeviz">
      <div className="treeviz__stage">
        <div className="treeviz__scroll">
          {nodes.length === 0 ? (
            <p className="treeviz__empty">The tree is empty. Build or insert nodes to begin.</p>
          ) : (
            <div
              className="treeviz__board"
              style={{ width: boardWidth, height: boardHeight }}
              role="img"
              aria-label={`Tree with ${nodes.length} nodes. ${snapshot?.status ?? ''}`}
            >
              <svg
                className="treeviz__edges"
                width={boardWidth}
                height={boardHeight}
                aria-hidden="true"
              >
                {nodes.map((node) => {
                  const from = pos(node);
                  return ['leftId', 'rightId']
                    .map((side) => {
                      const childId = node[side];
                      if (!childId || !byId.has(childId)) return null;
                      const to = pos(byId.get(childId));
                      const active =
                        snapshot &&
                        ((snapshot.pathIds ?? []).includes(node.id) &&
                          (snapshot.pathIds ?? []).includes(childId));
                      return (
                        <line
                          key={`${node.id}-${side}`}
                          x1={from.x}
                          y1={from.y + 20}
                          x2={to.x}
                          y2={to.y - 20}
                          className={'treeviz__edge' + (active ? ' treeviz__edge--active' : '')}
                        />
                      );
                    })
                    .filter(Boolean);
                })}
              </svg>
              {nodes.map((node) => {
                const { x, y } = pos(node);
                const tag = tagFor(snapshot, node);
                return (
                  <motion.div
                    key={node.id}
                    className="treeviz__node-wrap"
                    style={{ left: x - NODE_W / 2, top: y - 20 }}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  >
                    {tag ? (
                      <span
                        className={
                          'treeviz__tag' +
                          (node.isRoot ? ' treeviz__tag--root' : '') +
                          (node.isLeaf && !node.isRoot ? ' treeviz__tag--leaf' : '')
                        }
                      >
                        {tag}
                      </span>
                    ) : (
                      <span className="treeviz__tag treeviz__tag--spacer" aria-hidden="true" />
                    )}
                    <div
                      className={'tree-node' + nodeState(snapshot, node)}
                      aria-label={`Node value ${node.value}${node.isRoot ? ', root' : ''}${node.isLeaf ? ', leaf' : ''}`}
                    >
                      <span className="tree-node__value">{node.value}</span>
                      {snapshot?.currentId === node.id && foundPhase ? (
                        <span className="tree-node__badge" aria-hidden="true">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <p className="treeviz__status" aria-live="polite">
          {snapshot ? snapshot.status : ''}
        </p>

        <div className="treeviz__result" aria-label="Traversal result" aria-live="polite">
          <span className="treeviz__result-label">
            {snapshot?.traversalName ? `${snapshot.traversalName} result` : 'Result'}
          </span>
          <span className="treeviz__result-values">
            {result.length === 0 ? '—' : result.join(' → ')}
          </span>
        </div>

        {snapshot?.stats ? (
          <div className="treeviz__facts" aria-label="Tree statistics">
            <span className="treeviz__fact">
              <span className="treeviz__fact-label">Nodes</span>
              <strong className="treeviz__fact-value">{snapshot.stats.nodes ?? nodes.length}</strong>
            </span>
            <span className="treeviz__fact">
              <span className="treeviz__fact-label">Height</span>
              <strong className="treeviz__fact-value">{snapshot.stats.height ?? tree.height}</strong>
            </span>
            <span className="treeviz__fact">
              <span className="treeviz__fact-label">Leaves</span>
              <strong className="treeviz__fact-value">
                {snapshot.stats.leaves ?? nodes.filter((n) => n.isLeaf).length}
              </strong>
            </span>
            {snapshot.visitedCount !== undefined && snapshot.totalCount !== undefined ? (
              <span className="treeviz__fact">
                <span className="treeviz__fact-label">Visited</span>
                <strong className="treeviz__fact-value">
                  {snapshot.visitedCount} / {snapshot.totalCount}
                </strong>
              </span>
            ) : null}
            {snapshot.stats.checked !== undefined ? (
              <span className="treeviz__fact">
                <span className="treeviz__fact-label">Checked</span>
                <strong className="treeviz__fact-value">{snapshot.stats.checked}</strong>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <aside className="treeviz__explain" aria-label={`Step explanation. ${snapshot?.badge}`}>
        <div className="treeviz__explain-head">
          <span className="treeviz__current">Current Step</span>
          <span className="treeviz__badge">{snapshot?.badge}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={snapshot?.key}
            className="treeviz__copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <h3 className="treeviz__text">{snapshot?.heading}</h3>
            <p className="treeviz__detail">{snapshot?.detail}</p>
            {complete && foundPhase ? (
              <p className="treeviz__found">
                <Check size={16} strokeWidth={2.5} />
                Found
              </p>
            ) : null}
            {complete && missPhase ? (
              <p className="treeviz__not-found">
                <SearchX size={16} strokeWidth={2.5} />
                Not found
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
        {complexity ? (
          <ul className="treeviz__complexity">
            {(complexity.operations ?? []).map(({ label, value }) => (
              <li className="treeviz__complexity-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
            {!(complexity.operations ?? []).length ? (
              <>
                {complexity.time ? (
                  <li className="treeviz__complexity-item">
                    <span>Time Complexity</span>
                    <strong>{complexity.time}</strong>
                  </li>
                ) : null}
                {complexity.space ? (
                  <li className="treeviz__complexity-item">
                    <span>Space Complexity</span>
                    <strong>{complexity.space}</strong>
                  </li>
                ) : null}
              </>
            ) : null}
          </ul>
        ) : null}
        {config?.heightNote ? <p className="treeviz__note">{config.heightNote}</p> : null}
      </aside>
    </div>
  );
}
