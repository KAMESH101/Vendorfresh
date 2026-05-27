import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageVariants = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

export default function NotFound() {
  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="not-found" id="main-content">
        <motion.div
          className="not-found-code"
          initial={prefersReducedMotion ? {} : { scale: 0.5, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          404
        </motion.div>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <motion.button
            className="btn btn-primary"
            whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
          >
            Go Home
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
