import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

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

const floatingVariants = prefersReducedMotion
  ? {}
  : {
      animate: {
        y: [0, -12, 0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      },
    };

const floatingVariants2 = prefersReducedMotion
  ? {}
  : {
      animate: {
        y: [0, -8, 0],
        transition: {
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        },
      },
    };

const floatingVariants3 = prefersReducedMotion
  ? {}
  : {
      animate: {
        y: [0, -15, 0],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        },
      },
    };

const featuredProducts = products.slice(0, 3);

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Hero Section with Parallax */}
      <section className="hero" ref={heroRef}>
        <motion.div
          className="hero-bg"
          style={prefersReducedMotion ? {} : { y: bgY }}
        />
        <div className="hero-overlay" />

        {/* Floating SVG Icons */}
        <motion.div
          className="hero-floating-icon"
          style={{ top: '15%', left: '10%', fontSize: '3rem' }}
          variants={floatingVariants}
          animate="animate"
          aria-hidden="true"
        >
          🌿
        </motion.div>
        <motion.div
          className="hero-floating-icon"
          style={{ top: '25%', right: '12%', fontSize: '2.5rem' }}
          variants={floatingVariants2}
          animate="animate"
          aria-hidden="true"
        >
          🥕
        </motion.div>
        <motion.div
          className="hero-floating-icon"
          style={{ bottom: '20%', left: '20%', fontSize: '2.8rem' }}
          variants={floatingVariants3}
          animate="animate"
          aria-hidden="true"
        >
          🌾
        </motion.div>
        <motion.div
          className="hero-floating-icon"
          style={{ bottom: '30%', right: '18%', fontSize: '2rem' }}
          variants={floatingVariants}
          animate="animate"
          aria-hidden="true"
        >
          🍋
        </motion.div>

        {/* Content */}
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            From Farm to Fork
            <br />
            Fresh Indian Produce
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Empowering farmers to sell directly to you. Fresh vegetables,
            fruits, spices, and grains — managed by trusted village heads.
          </motion.p>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/products">
              <motion.button
                className="btn btn-primary"
                whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              >
                Shop Now
              </motion.button>
            </Link>
            <Link to="/farmers">
              <motion.button
                className="btn btn-secondary"
                whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              >
                Meet Our Farmers
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="main-content">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">
            Hand-picked selections from our finest farmers across India
          </p>
          <div className="products-grid">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products">
              <motion.button
                className="btn btn-outline"
                whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              >
                View All Products →
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className="section"
        style={{ background: 'rgba(45, 106, 79, 0.04)' }}
      >
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to get farm-fresh produce delivered to your door
          </p>
          <div className="how-it-works">
            {[
              {
                icon: '🔍',
                title: 'Browse',
                desc: 'Explore our curated collection of fresh produce from verified farmers across India.',
              },
              {
                icon: '🛒',
                title: 'Order',
                desc: 'Add items to your cart, choose quantities, and place your order securely.',
              },
              {
                icon: '🚚',
                title: 'Deliver',
                desc: 'Get farm-fresh products delivered to your doorstep, managed by local village heads.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                className="how-step"
                initial={
                  prefersReducedMotion
                    ? {}
                    : { opacity: 0, y: 30 }
                }
                whileInView={
                  prefersReducedMotion
                    ? {}
                    : { opacity: 1, y: 0 }
                }
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="how-step-icon" aria-hidden="true">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
