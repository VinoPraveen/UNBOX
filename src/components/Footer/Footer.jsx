import { Link } from 'react-router-dom';
import { GitBranch, ExternalLink } from 'lucide-react';
import './Footer.css';

const EXPLORE_LINKS = [
  { label: 'Concepts', to: '/explore' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/#about' },
];

const CONNECT_LINKS = [
  { label: 'GitHub', href: '#', Icon: GitBranch },
  { label: 'LinkedIn', href: '#', Icon: ExternalLink },
];

export default function Footer() {
  return (
    <footer id="about" className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__wordmark">
            <span className="footer__logo" aria-hidden="true" />
            <span className="footer__name">UNBOX</span>
          </div>
          <p className="footer__tagline">See what's inside.</p>
        </div>

        <div className="footer__links">
          <nav className="footer__col" aria-label="Explore">
            <h3 className="footer__col-title">Explore</h3>
            <ul className="footer__list">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link className="footer__link" to={link.to}>
                      {link.label}
                    </Link>
                  ) : (
                    <a className="footer__link" href={link.href}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Connect">
            <h3 className="footer__col-title">Connect</h3>
            <ul className="footer__list">
              {CONNECT_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a className="footer__link" href={href}>
                    <Icon size={15} strokeWidth={2} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span className="footer__copyright">© 2026 UNBOX</span>
          <span className="footer__slogan">See what's inside.</span>
        </div>
      </div>
    </footer>
  );
}
