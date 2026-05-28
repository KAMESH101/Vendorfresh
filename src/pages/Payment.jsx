import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import { supabase } from '../lib/supabaseClient';

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

// Dynamic script loader utility for Razorpay Checkout
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const { cartItems, cartTotal, dispatch } = useCart();
  const { user } = useAuth();
  
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadRazorpayScript().then((res) => {
      setScriptLoaded(res);
    });
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    
    if (!form.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!form.phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(form.phone)) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!form.address.trim()) {
      errs.address = 'Delivery address is required';
    } else if (form.address.trim().length < 10) {
      errs.address = 'Please provide a complete shipping address';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    // Check if script failed to load or key is a mock developer placeholder
    if (!scriptLoaded || !razorpayKey || razorpayKey.includes('mockKey')) {
      // Execute a local mock success simulation callback
      setTimeout(async () => {
        const orderData = {
          user_id: 'anonymous',
          items: cartItems,
          total_amount: cartTotal,
          payment_status: 'paid',
          razorpay_order_id: 'mock_order_id_' + Date.now(),
          razorpay_payment_id: 'mock_payment_id_' + Date.now(),
          delivery_name: form.name,
          delivery_email: form.email,
          delivery_phone: form.phone,
          delivery_address: form.address,
          created_at: new Date().toISOString()
        };

        try {
          const { error } = await supabase.from('orders').insert(orderData);
          if (error) console.warn('Supabase save failed, using local fallback:', error.message);
        } catch (dbErr) {
          console.warn('Supabase connection error, using local fallback:', dbErr);
        }

        // Save locally as fallback to guarantee profile display
        const localOrders = JSON.parse(localStorage.getItem('vendorfresh_local_orders') || '[]');
        localOrders.unshift(orderData);
        localStorage.setItem('vendorfresh_local_orders', JSON.stringify(localOrders));

        setLoading(false);
        setPaid(true);
        dispatch({ type: 'CLEAR_CART' });
        setToast({
          visible: true,
          message: 'Success! Payment simulated (Mock Dev Mode).',
          type: 'success',
        });
      }, 1500);
      return;
    }

    try {
      const options = {
        key: razorpayKey,
        amount: cartTotal * 100, // Amount expected in paise (e.g. ₹100 = 10000 paise)
        currency: 'INR',
        name: 'VendorFresh',
        description: 'Direct Farm Produce Checkout',
        image: '/images/Logo.png',
        handler: async function (response) {
          const orderData = {
            user_id: 'anonymous',
            items: cartItems,
            total_amount: cartTotal,
            payment_status: 'paid',
            razorpay_order_id: response.razorpay_order_id || null,
            razorpay_payment_id: response.razorpay_payment_id,
            delivery_name: form.name,
            delivery_email: form.email,
            delivery_phone: form.phone,
            delivery_address: form.address,
            created_at: new Date().toISOString()
          };

          try {
            const { error } = await supabase.from('orders').insert(orderData);
            if (error) console.warn('Supabase save failed, using local fallback:', error.message);
          } catch (dbErr) {
            console.warn('Supabase connection error, using local fallback:', dbErr);
          }

          // Save locally as fallback to guarantee profile display
          const localOrders = JSON.parse(localStorage.getItem('vendorfresh_local_orders') || '[]');
          localOrders.unshift(orderData);
          localStorage.setItem('vendorfresh_local_orders', JSON.stringify(localOrders));

          setLoading(false);
          setPaid(true);
          dispatch({ type: 'CLEAR_CART' });
          setToast({
            visible: true,
            message: `Payment successful! ID: ${response.razorpay_payment_id}`,
            type: 'success',
          });
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: form.address,
        },
        theme: {
          color: '#2d6a4f', // VendorFresh brand primary green
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (response) {
        setLoading(false);
        setToast({
          visible: true,
          message: `Payment failed: ${response.error.description}`,
          type: 'error',
        });
      });
      rzpInstance.open();
    } catch (err) {
      setLoading(false);
      setToast({
        visible: true,
        message: 'Could not open Razorpay checkout. Using simulated checkout.',
        type: 'error',
      });
      console.error('Razorpay Error:', err);
    }
  };

  const closeToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

  if (paid) {
    return (
      <motion.div
        className="page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={closeToast} />
        <div className="container section success-container" id="main-content">
          <motion.div
            className="success-icon"
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            aria-hidden="true"
          >
            🎉
          </motion.div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your fresh produce is on its way!</p>
          <Link to="/products">
            <motion.button
              className="btn btn-primary"
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        className="page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="container section" id="main-content" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
          <h2>Your cart is empty</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
            Add some products before proceeding to payment.
          </p>
          <Link to="/products">
            <motion.button
              className="btn btn-primary"
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            >
              Browse Products
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={closeToast} />

      <div className="page-hero">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className="container section" id="main-content">
        <div className="payment-grid">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="order-total">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          {/* Delivery & Billing Form */}
          <div className="form-card" style={{ maxWidth: 'none' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'left' }}>
              Delivery Details
            </h2>
            {(!import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID.includes('mockKey')) && (
              <p style={{ color: 'var(--color-accent-dark)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                ⚠️ Running in Mock Mode (Payment will be simulated)
              </p>
            )}
            <form onSubmit={handlePayment} noValidate id="paymentForm">
              <div className="form-group">
                <label htmlFor="pay-name" className="form-label">Full Name</label>
                <input
                  id="pay-name"
                  type="text"
                  name="name"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="Recipient full name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="pay-email" className="form-label">Email Address</label>
                <input
                  id="pay-email"
                  type="email"
                  name="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="recipient@email.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!user}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="pay-phone" className="form-label">Mobile Number</label>
                <input
                  id="pay-phone"
                  type="tel"
                  name="phone"
                  className={`form-input${errors.phone ? ' error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="pay-address" className="form-label">Delivery Address</label>
                <textarea
                  id="pay-address"
                  name="address"
                  className={`form-input${errors.address ? ' error' : ''}`}
                  placeholder="Street, Landmark, Village/City, State - PIN code"
                  value={form.address}
                  onChange={handleChange}
                  style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', padding: '10px' }}
                />
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>

              <motion.button
                type="submit"
                className="btn btn-cart"
                disabled={loading}
                style={{ width: '100%', marginTop: '1rem' }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
              >
                {loading ? 'Processing...' : `Pay ₹${cartTotal}`}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
