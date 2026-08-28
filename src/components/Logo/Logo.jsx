import React from 'react';
import './Logo.css';

export default function Logo() {
  return (
    <a href="/" className="logo" aria-label="UNBOX home">
      <img
        className="logo__img"
        src="/logo.png"
        alt=""
        aria-hidden="true"
      />
      <span className="logo__name">UNBOX</span>
    </a>
  );
}
