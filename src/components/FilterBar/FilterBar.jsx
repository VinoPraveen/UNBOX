import { CATEGORIES, DIFFICULTIES } from '../../data/concepts.js';
import './FilterBar.css';

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        <span className="filter-bar__label" id="category-label">Category</span>
        <div className="filter-bar__options" role="radiogroup" aria-labelledby="category-label">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-bar__btn${selectedCategory === cat ? ' is-active' : ''}`}
              onClick={() => onCategoryChange(cat)}
              role="radio"
              aria-checked={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-bar__divider" aria-hidden="true" />

      <div className="filter-bar__group">
        <span className="filter-bar__label" id="difficulty-label">Difficulty</span>
        <div className="filter-bar__options" role="radiogroup" aria-labelledby="difficulty-label">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              className={`filter-bar__btn${selectedDifficulty === diff ? ' is-active' : ''}`}
              onClick={() => onDifficultyChange(diff)}
              role="radio"
              aria-checked={selectedDifficulty === diff}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
