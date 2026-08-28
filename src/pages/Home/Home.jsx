import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import InteractiveDemo from '../../components/InteractiveDemo/InteractiveDemo.jsx';
import HowItWorks from '../../components/HowItWorks/HowItWorks.jsx';
import ExploreConcepts from '../../components/ExploreConcepts/ExploreConcepts.jsx';
import './Home.css';
// this is vetri
const SUGGESTED_TOPICS = ['Arrays', 'Recursion', 'HTTP', 'Binary Search'];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Home() {
  const [query, setQuery] = useState('');

  return (
    <main>
      <div className="home">
        <section id="explore" className="hero">
          <motion.div
            className="hero__content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.p className="hero__label" variants={itemVariants}>
              Interactive Visual Learning
            </motion.p>

            <motion.h1 className="hero__heading" variants={itemVariants}>
              See what's inside.
            </motion.h1>

            <motion.p className="hero__subtitle" variants={itemVariants}>
              Understand software and computer science concepts through
              interactive visualizations, step-by-step explanations, and hands-on
              exploration.
            </motion.p>

            <motion.div variants={itemVariants} className="hero__search">
              <div className="search">
                <Search className="search__icon" size={20} aria-hidden="true" />
                <input
                  className="search__input"
                  type="search"
                  placeholder="What do you want to unbox?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="What do you want to unbox?"
                />
              </div>

              <div className="try">
                <span className="try__label">Try:</span>
                <ul className="try__tags">
                  {SUGGESTED_TOPICS.map((topic) => (
                    <li key={topic}>
                      <button
                        className="try__tag"
                        type="button"
                        onClick={() => setQuery(topic)}
                      >
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div className="hero__actions" variants={itemVariants}>
              <a href="#get-started" className="btn btn-gold hero__cta">
                Start Exploring
                <ArrowRight size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
          >
            <InteractiveDemo />
          </motion.div>
        </section>
      </div>
      <HowItWorks />

      <ExploreConcepts />
    </main>
  );
}
