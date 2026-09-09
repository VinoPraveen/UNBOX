import { Link } from 'react-router-dom';
import { getAlgorithmGroups } from '../../../algorithms/registry.js';
import './AlgorithmSwitcher.css';

export default function AlgorithmSwitcher({ currentSlug }) {
  const groups = getAlgorithmGroups();

  return (
    <nav
      className="algorithm-switcher"
      aria-label="Algorithms"
      style={{ maxWidth: 'var(--container-max)' }}
    >
      {groups.map((group) => (
        <div className="algorithm-switcher__group" key={group.name}>
          <span className="algorithm-switcher__label">{group.name}</span>
          <div className="algorithm-switcher__items">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                to={`/playground/${item.slug}`}
                className={
                  'algorithm-switcher__link' +
                  (item.slug === currentSlug ? ' algorithm-switcher__link--active' : '')
                }
                aria-current={item.slug === currentSlug ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}