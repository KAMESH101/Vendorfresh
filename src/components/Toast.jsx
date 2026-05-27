import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`toast toast-${type}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 80, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, x: 80 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            role="alert"
          >
            <span className="toast-icon" aria-hidden="true">
              {type === 'success' ? '✅' : '❌'}
            </span>
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
