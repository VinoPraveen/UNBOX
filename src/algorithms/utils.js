export function gather(values) {
  return values.join(' \u00B7 ');
}

export function noun(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export function randomUniqueArray(count, min = 1, max = 99) {
  if (max - min + 1 < count) {
    return Array.from({ length: count }, () => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });
  }
  const pool = [];
  const picked = new Set();
  while (pool.length < count) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!picked.has(value)) {
      picked.add(value);
      pool.push(value);
    }
  }
  return pool;
}