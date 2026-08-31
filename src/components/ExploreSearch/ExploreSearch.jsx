import { Search } from 'lucide-react';
import './ExploreSearch.css';

export default function ExploreSearch({ value, onChange }) {
  return (
    <div className="explore-search">
      <Search className="explore-search__icon" size={20} aria-hidden="true" />
      <input
        className="explore-search__input"
        type="search"
        placeholder="Search concepts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search concepts"
      />
    </div>
  );
}
