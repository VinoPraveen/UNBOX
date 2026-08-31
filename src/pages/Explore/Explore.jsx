import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import concepts from '../../data/concepts.js';
import ExploreSearch from '../../components/ExploreSearch/ExploreSearch.jsx';
import FilterBar from '../../components/FilterBar/FilterBar.jsx';
import ExploreConceptCard from '../../components/ExploreConceptCard/ExploreConceptCard.jsx';
import './Explore.css';

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return concepts.filter((c) => {
      const matchesSearch = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
  };

  const hasFilters = searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All';
  const count = filtered.length;

  return (
    <main className="explore-page">
      <div className="explore-page__glow" aria-hidden="true" />

      <div className="explore-page__inner">
        <motion.div
          className="explore-page__hero"
          initial="hidden"
          animate="show"
          variants={headerVariants}
        >
          <p className="explore-page__label">Explore UNBOX</p>
          <h1 className="explore-page__heading">What do you want to understand?</h1>
          <p className="explore-page__description">
            Explore interactive concepts, visualize how they work, and learn
            what&apos;s happening underneath.
          </p>

          <ExploreSearch value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        <motion.div
          className="explore-page__controls"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
        >
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
          />
        </motion.div>

        <div className="explore-page__meta">
          <p className="explore-page__count">
            {count} {count === 1 ? 'concept' : 'concepts'}
          </p>
          {hasFilters && (
            <button
              type="button"
              className="explore-page__clear"
              onClick={clearFilters}
            >
              <RotateCcw size={14} aria-hidden="true" />
              Clear Filters
            </button>
          )}
        </div>

        {count > 0 ? (
          <motion.div
            className="explore-page__grid"
            key={`${selectedCategory}-${selectedDifficulty}-${searchQuery}`}
            initial="hidden"
            animate="show"
            variants={gridVariants}
          >
            {filtered.map((concept) => (
              <ExploreConceptCard key={concept.id} concept={concept} />
            ))}
          </motion.div>
        ) : (
          <div className="explore-page__empty">
            <p className="explore-page__empty-title">No concepts found.</p>
            <p className="explore-page__empty-text">Try a different search or filter.</p>
            <button type="button" className="btn btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
