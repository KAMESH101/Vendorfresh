import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCart } from '../hooks/useCart';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProductCard({ product, index = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { dispatch } = useCart();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: product });

    // Animate the cart icon with a bounce
    const cartBtn = document.querySelector('.cart-button');
    if (cartBtn && !prefersReducedMotion) {
      cartBtn.style.transform = 'scale(1.4)';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
      }, 200);
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1.15)';
      }, 300);
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
      }, 400);
    }
  };

  const scrollVariants = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      };

  return (
    <motion.div
      ref={ref}
      className="product-card-wrapper"
      variants={scrollVariants}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      animate={
        prefersReducedMotion ? undefined : isInView ? 'visible' : 'hidden'
      }
    >
      <motion.div
        className="product-card-inner"
        animate={
          prefersReducedMotion ? {} : { rotateY: isFlipped ? 180 : 0 }
        }
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onHoverStart={() => !prefersReducedMotion && setIsFlipped(true)}
        onHoverEnd={() => !prefersReducedMotion && setIsFlipped(false)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div className="product-card-front">
          <div className="product-image-container">
            <img
              className="product-image"
              src={product.image}
              alt={`${product.name} — fresh ${product.category.toLowerCase()} from ${product.region}`}
              loading="lazy"
            />
            <span className="product-category-badge">{product.category}</span>
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-farmer">
              By {product.farmer}, {product.region}
            </p>
            <div className="product-price-row">
              <span className="product-price">
                ₹{product.price}
                <span className="product-unit"> / {product.unit}</span>
              </span>
            </div>
          </div>
          <p className="product-flip-hint">Hover to see details</p>
        </div>

        {/* Back Face */}
        <div className="product-card-back">
          <h4>{product.name}</h4>
          <p className="farmer-info">
            👨‍🌾 {product.farmer} — {product.region}
          </p>
          <p className="product-desc">{product.description}</p>
          <p style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>
            ₹{product.price} / {product.unit}
          </p>
          <motion.button
            className="btn btn-cart"
            onClick={handleAddToCart}
            whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            style={{ maxWidth: '200px' }}
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
