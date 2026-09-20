import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, SearchX } from 'lucide-react';
import { VIEW_W, VIEW_H } from '../../../algorithms/graphs/graphSteps.js';
import './GraphVisualization.css';

const RADIUS = 24;

const STATE_TAG = {
  start: 'START',
  current: 'CURRENT',
  queued: 'QUEUED',
  visited: 'VISITED',
  found: 'FOUND',
};

function shorten(from, to, trimFrom, trimTo) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x1: from.x + (dx / len) * trimFrom,
    y1: from.y + (dy / len) * trimFrom,
    x2: to.x - (dx / len) * trimTo,
    y2: to.y - (dy / len) * trimTo,
  };
}

export default function GraphVisualization({ config, complexity, snapshot }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  // Drag offsets are local UI state (the graph model never stores coordinates).
  // A new operation remounts this component via key={runId}, so offsets never
  // leak across runs.
  const [offsets, setOffsets] = useState({});

  const layout = snapshot?.layout ?? { nodes: [], edges: [] };
  const nodeStates = snapshot?.nodeStates ?? {};
  const edgeStates = snapshot?.edgeStates ?? {};
  const directed = snapshot?.directed ?? false;
  const target = snapshot?.target ?? null;

  const posOf = (id) => {
    const base = (layout.nodes ?? []).find((n) => n.id === id);
    if (!base) return null;
    const off = offsets[id] ?? { dx: 0, dy: 0 };
    return { x: base.x + off.dx, y: base.y + off.dy };
  };

  const toSvgCoords = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = new DOMPoint(clientX, clientY);
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const local = pt.matrixTransform(matrix.inverse());
    return { x: local.x, y: local.y };
  };

  const onNodePointerDown = (id) => (event) => {
    event.preventDefault();
    event.target.setPointerCapture?.(event.pointerId);
    const start = toSvgCoords(event.clientX, event.clientY);
    const prev = offsets[id] ?? { dx: 0, dy: 0 };
    dragRef.current = { id, startX: start.x, startY: start.y, dx: prev.dx, dy: prev.dy };
  };

  const onSvgPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const current = toSvgCoords(event.clientX, event.clientY);
    const dx = Math.max(-260, Math.min(260, drag.dx + current.x - drag.startX));
    const dy = Math.max(-180, Math.min(180, drag.dy + current.y - drag.startY));
    setOffsets((prev) => ({ ...prev, [drag.id]: { dx, dy } }));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const panel = snapshot?.panelKind;
  const panelItems = panel === 'queue' ? (snapshot?.queue ?? []) : snapshot?.stack ?? [];
  const result = snapshot?.result ?? [];
  const path = snapshot?.path ?? [];
  const complete = Boolean(snapshot?.complete);
  const foundPhase = snapshot?.phase === 'found';
  const missPhase = snapshot?.phase === 'miss';

  return (
    <div className="gviz">
      <div className="gviz__stage">
        <div className="gviz__scroll">
          {(layout.nodes ?? []).length === 0 ? (
            <p className="gviz__empty">The graph is empty. Add nodes and edges to begin.</p>
          ) : (
            <svg
              ref={svgRef}
              className="gviz__canvas"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              role="img"
              aria-label={`Graph with ${(layout.nodes ?? []).length} nodes. ${snapshot?.status ?? ''}`}
              onPointerMove={onSvgPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <defs>
                <marker
                  id="gviz-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" className="gviz__arrow-head" />
                </marker>
                <marker
                  id="gviz-arrow-active"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" className="gviz__arrow-head--active" />
                </marker>
              </defs>

              {(layout.edges ?? []).map((edge) => {
                const from = posOf(edge.from);
                const to = posOf(edge.to);
                if (!from || !to) return null;
                const isDirected = edge.directed ?? directed;
                const line = shorten(from, to, RADIUS + 2, RADIUS + (isDirected ? 8 : 2));
                const active = edgeStates[edge.id] === 'active';
                const midX = (line.x1 + line.x2) / 2;
                const midY = (line.y1 + line.y2) / 2;
                return (
                  <g key={edge.id}>
                    <line
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      className={'gviz__edge' + (active ? ' gviz__edge--active' : '')}
                      markerEnd={isDirected ? `url(#${active ? 'gviz-arrow-active' : 'gviz-arrow'})` : undefined}
                    />
                    {edge.weight !== null && edge.weight !== undefined ? (
                      <g>
                        <rect
                          x={midX - 16}
                          y={midY - 11}
                          width="32"
                          height="20"
                          rx="10"
                          className="gviz__weight-bg"
                        />
                        <text x={midX} y={midY + 4.5} textAnchor="middle" className="gviz__weight">
                          {edge.weight}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })}

              {(layout.nodes ?? []).map((node) => {
                const pos = posOf(node.id);
                const state = nodeStates[node.id];
                const isTarget = target && node.id === target && state !== 'found';
                const tag = STATE_TAG[state] ?? (isTarget ? 'TARGET' : '');
                return (
                  <g key={node.id}>
                    {tag ? (
                      <text x={pos.x} y={pos.y - RADIUS - 8} textAnchor="middle" className={'gviz__tag' + (state === 'found' ? ' gviz__tag--found' : '') + (state === 'current' ? ' gviz__tag--current' : '')}>
                        {tag}
                      </text>
                    ) : null}
                    <motion.g
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      style={{ x: pos.x, y: pos.y }}
                    >
                      <circle
                        r={RADIUS}
                        className={
                          'gviz-node' +
                          (state ? ` gviz-node--${state}` : '') +
                          (isTarget ? ' gviz-node--target' : '')
                        }
                        onPointerDown={onNodePointerDown(node.id)}
                        style={{ cursor: 'grab' }}
                      >
                        <title>{`Node ${node.id}${state ? `, ${state}` : ''}. Drag to reposition.`}</title>
                      </circle>
                      <text textAnchor="middle" dy="6" className="gviz-node__label" pointerEvents="none">
                        {node.id}
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        <p className="gviz__hint">Drag nodes to reposition — edges stay connected.</p>

        <p className="gviz__status" aria-live="polite">
          {snapshot ? snapshot.status : ''}
        </p>

        {panel ? (
          <div className="gviz__panel" aria-label={panel === 'queue' ? 'Queue state' : 'Stack state'} aria-live="polite">
            <span className="gviz__panel-label">
              {panel === 'queue' ? 'QUEUE — front ← · → back' : 'STACK — top on the right'}
            </span>
            <span className="gviz__panel-values">
              {panelItems.length === 0 ? '(empty)' : panel === 'queue' ? panelItems.join(' · ') : panelItems.join(' · ')}
            </span>
          </div>
        ) : null}

        <div className="gviz__result" aria-label="Traversal result" aria-live="polite">
          <span className="gviz__result-label">Visit order</span>
          <span className="gviz__result-values">
            {result.length === 0 ? '—' : result.join(' → ')}
          </span>
          {path.length > 0 ? (
            <span className="gviz__result-path">Path: {path.join(' → ')}</span>
          ) : null}
        </div>

        {snapshot?.stats ? (
          <div className="gviz__facts" aria-label="Graph statistics">
            <span className="gviz__fact">
              <span className="gviz__fact-label">Nodes</span>
              <strong className="gviz__fact-value">{snapshot.stats.nodes}</strong>
            </span>
            <span className="gviz__fact">
              <span className="gviz__fact-label">Edges</span>
              <strong className="gviz__fact-value">{snapshot.stats.edges}</strong>
            </span>
            <span className="gviz__fact">
              <span className="gviz__fact-label">Visited</span>
              <strong className="gviz__fact-value">{snapshot.stats.visited ?? 0}</strong>
            </span>
            <span className="gviz__fact">
              <span className="gviz__fact-label">Edges examined</span>
              <strong className="gviz__fact-value">{snapshot.stats.edgesExamined ?? 0}</strong>
            </span>
            {snapshot.stats.found !== undefined ? (
              <span className="gviz__fact">
                <span className="gviz__fact-label">Found</span>
                <strong className="gviz__fact-value">{snapshot.stats.found ? 'Yes' : 'No'}</strong>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <aside className="gviz__explain" aria-label={`Step explanation. ${snapshot?.badge}`}>
        <div className="gviz__explain-head">
          <span className="gviz__current">Current Step</span>
          <span className="gviz__badge">{snapshot?.badge}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={snapshot?.key}
            className="gviz__copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <h3 className="gviz__text">{snapshot?.heading}</h3>
            <p className="gviz__detail">{snapshot?.detail}</p>
            {complete && foundPhase ? (
              <p className="gviz__found">
                <Check size={16} strokeWidth={2.5} />
                Found
              </p>
            ) : null}
            {complete && missPhase ? (
              <p className="gviz__not-found">
                <SearchX size={16} strokeWidth={2.5} />
                Not found
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>
        {complexity ? (
          <ul className="gviz__complexity">
            {(complexity.operations ?? []).map(({ label, value }) => (
              <li className="gviz__complexity-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </li>
            ))}
          </ul>
        ) : null}
        {config?.orderNote ? <p className="gviz__note">{config.orderNote}</p> : null}
      </aside>
    </div>
  );
}
