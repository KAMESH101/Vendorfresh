import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, cartTotal, dispatch } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            initial={prefersReducedMotion ? {} : { x: '100%' }}
            animate={prefersReducedMotion ? {} : { x: 0 }}
            exit={prefersReducedMotion ? {} : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h2>Your Cart ({cartItems.length})</h2>
              <button
                className="cart-close-btn"
                onClick={onClose}
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon" aria-hidden="true">🛒</div>
                  <p>Your cart is empty</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                    Browse our fresh products and add some to your cart!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      layout={!prefersReducedMotion}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    >
                      <img
                        className="cart-item-image"
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                      />
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">
                          ₹{item.price * item.quantity}
                        </div>
                        <div className="cart-item-controls">
                          <motion.button
                            className="qty-btn"
                            aria-label={`Decrease quantity of ${item.name}`}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                            onClick={() =>
                              item.quantity > 1
                                ? dispatch({
                                    type: 'UPDATE_QUANTITY',
                                    payload: {
                                      id: item.id,
                                      quantity: item.quantity - 1,
                                    },
                                  })
                                : dispatch({
                                    type: 'REMOVE_ITEM',
                                    payload: item.id,
                                  })
                            }
                          >
                            −
                          </motion.button>
                          <span className="cart-item-qty">{item.quantity}</span>
                          <motion.button
                            className="qty-btn"
                            aria-label={`Increase quantity of ${item.name}`}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: {
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                },
                              })
                            }
                          >
                            +
                          </motion.button>
                          <button
                            className="cart-item-remove"
                            onClick={() =>
                              dispatch({
                                type: 'REMOVE_ITEM',
                                payload: item.id,
                              })
                            }
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-total-row">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-value">₹{cartTotal}</span>
                </div>
                <Link to="/payment" onClick={onClose}>
                  <motion.button
                    className="btn btn-cart"
                    whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    style={{ width: '100%' }}
                  >
                    Proceed to Payment
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
