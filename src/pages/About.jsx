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

const values = [
  {
    icon: '🌾',
    title: 'Direct From Farmers',
    desc: 'We cut out the middlemen so farmers earn more and you pay less for premium quality produce.',
  },
  {
    icon: '✅',
    title: 'Quality Verified',
    desc: 'Every product is inspected by trusted village heads before reaching your doorstep.',
  },
  {
    icon: '🤝',
    title: 'Fair Trade',
    desc: 'We ensure fair pricing for both farmers and customers, building a sustainable ecosystem.',
  },
  {
    icon: '🚛',
    title: 'Fresh Delivery',
    desc: 'From harvest to your home in the shortest time possible, preserving freshness and nutrition.',
  },
  {
    icon: '🌍',
    title: 'Pan-India Network',
    desc: 'Connecting farmers from Punjab to Kerala, Kashmir to Tamil Nadu — all of India on one platform.',
  },
  {
    icon: '💚',
    title: 'Sustainable Farming',
    desc: 'We promote organic and sustainable farming practices to protect our land for future generations.',
  },
];

export default function About() {
  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="about-hero">
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Our Mission
        </motion.h1>
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          VendorFresh connects Indian farmers with customers nationwide,
          ensuring fair prices, fresh produce, and a sustainable agricultural
          ecosystem. We believe every farmer deserves direct market access and
          every consumer deserves to know where their food comes from.
        </motion.p>
      </div>

      <div className="container section" id="main-content">
        <h2 className="section-title">Our Values</h2>
        <p className="section-subtitle">
          The principles that guide everything we do at VendorFresh
        </p>
        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="value-card"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="value-card-icon" aria-hidden="true">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
