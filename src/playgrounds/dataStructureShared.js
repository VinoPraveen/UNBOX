let historyKey = 0;

export function parseNumber(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return { ok: false, reason: 'empty' };
  }
  const number = Number(raw);
  if (!Number.isFinite(number)) return { ok: false, reason: 'invalid' };
  return { ok: true, value: number };
}

export function withHistory(history, message, previousItems) {
  historyKey += 1;
  return [...history, { id: historyKey, message, items: previousItems }].slice(-50);
}