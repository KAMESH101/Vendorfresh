import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import staticFarmers, { getFarmers } from '../data/farmers';

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

export default function Farmers() {
  const [farmersList, setFarmersList] = useState(staticFarmers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmers() {
      try {
        const { data, error } = await getFarmers();
        if (data && !error) {
          setFarmersList(data);
        }
      } catch (err) {
        console.error('Failed to load farmers from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmers();
  }, []);

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
        <h1>Meet Our Farmers</h1>
        <p>The hardworking people behind your fresh produce</p>
      </div>

      <div className="container section" id="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
            <p>Loading farmer profiles...</p>
          </div>
        ) : (
          <div className="farmers-grid">
            {farmersList.map((farmer, i) => (
              <motion.div
                key={farmer.id}
                className="farmer-card"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.95 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <img
                  className="farmer-avatar"
                  src={farmer.image}
                  alt={`${farmer.name}, farmer from ${farmer.region}`}
                  loading="lazy"
                />
                <h3 className="farmer-name">{farmer.name}</h3>
                <p className="farmer-region">{farmer.region}</p>
                <p className="farmer-quote">"{farmer.quote}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
