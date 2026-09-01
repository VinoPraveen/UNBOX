import { motion } from 'framer-motion';
import './ConceptNav.css';

const navVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ConceptNav({ items, active }) {
  const scrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.nav
      className="concept-nav"
      aria-label="Concept sections"
      initial="hidden"
      animate="show"
      variants={navVariants}
    >
      <div className="concept-nav__inner">
        <ul className="concept-nav__list">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    'concept-nav__item' + (isActive ? ' concept-nav__item--active' : '')
                  }
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}
