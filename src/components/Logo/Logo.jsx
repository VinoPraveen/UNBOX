import { Link } from 'react-router-dom';
import './Logo.css';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="UNBOX home">
      <img
        className="logo__img"
        src="/logo.png"
        alt=""
        aria-hidden="true"
      />
      <span className="logo__name">UNBOX</span>
    </Link>
  );
}
