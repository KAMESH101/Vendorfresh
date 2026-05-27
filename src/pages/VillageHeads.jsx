import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { villageHeads } from '../data/farmers';

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

export default function VillageHeads() {
  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="page-hero">
        <h1>Village Head Managers</h1>
        <p>
          Village heads oversee local farmer listings, verify quality, and
          handle logistics for their region.
        </p>
      </div>

      <div className="container section" id="main-content" style={{ paddingBottom: '2rem' }}>
        <div className="farmers-grid">
          {villageHeads.map((head, i) => (
            <motion.div
              key={head.id}
              className="village-head-card"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.95 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div>
                <h3 className="village-head-name">{head.name}</h3>
                <p className="village-head-village">{head.village}</p>
                <p className="village-head-role">{head.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Application CTA Block */}
        <motion.div 
          className="village-apply-cta"
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <h2>Interested in managing your village?</h2>
          <p>
            Village Head Managers are tech experts who oversee local farmer listings,
            verify crop quality, coordinate regional logistics, and handle our robust administration portal.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Apply as Manager
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

