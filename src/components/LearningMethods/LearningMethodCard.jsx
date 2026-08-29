import React from 'react';
import { motion } from 'framer-motion';
import './LearningMethodCard.css';

const hoverSpring = { type: 'spring', stiffness: 400, damping: 30 };

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  hover: { y: -6, transition: hoverSpring },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  hover: { scale: 1.08, transition: hoverSpring },
};

export default function LearningMethodCard({ method }) {
  const { Icon, title, description, accent } = method;

  return (
    <motion.li
      className="methods-card"
      style={{ '--card-accent': accent }}
      variants={cardVariants}
      whileHover="hover"
    >
      <motion.div className="methods-card__icon" variants={iconVariants}>
        <Icon size={24} strokeWidth={2} aria-hidden="true" />
      </motion.div>
      <h3 className="methods-card__title">{title}</h3>
      <p className="methods-card__desc">{description}</p>
      <span className="methods-card__bar" aria-hidden="true" />
    </motion.li>
  );
}