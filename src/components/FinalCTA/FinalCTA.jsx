import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './FinalCTA.css';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  hover: { y: -2, transition: { duration: 0.2, ease: 'easeOut' } },
};

const arrowVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
  hover: { x: 4, transition: { duration: 0.2, ease: 'easeOut' } },
};

export default function FinalCTA() {
  return (
    <section id="get-started" className="cta">
      <div className="cta__glow" aria-hidden="true" />
      <motion.div
        className="cta__inner"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <div className="cta__visual" aria-hidden="true">
          <motion.div
            className="cta__box"
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
          >
            <motion.span
              className="cta__beam"
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: {
                  opacity: 1,
                  scaleX: 1,
                  transition: { duration: 0.5, ease: 'easeOut', delay: 0.25 },
                },
              }}
            />
          </motion.div>
        </div>

        <motion.p className="cta__label" variants={itemVariants}>
          Ready to Unbox?
        </motion.p>

        <motion.h2 className="cta__heading" variants={itemVariants}>
          There's more to every concept.
        </motion.h2>

        <motion.p className="cta__text" variants={itemVariants}>
          Choose something you're curious about and start exploring how it really
          works.
        </motion.p>

        <motion.div className="cta__action" variants={itemVariants}>
          <motion.a
            className="btn btn-gold cta__button"
            href="#explore"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            Start Exploring
            <motion.span
              className="cta__arrow"
              variants={arrowVariants}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </motion.span>
          </motion.a>
          <p className="cta__note">
            No complicated setup. Just pick a concept and start learning.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
