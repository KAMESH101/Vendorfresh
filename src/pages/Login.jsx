import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignIn } from '@clerk/clerk-react';
import { useAuth } from '../hooks/useAuth';
import { isMockAuth } from '../lib/clerk';
import Toast from '../components/Toast';

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

function MockLoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    login(form.email, form.password);
    setToast({ visible: true, message: 'Login successful! Welcome back (Mock Mode).', type: 'success' });
    setTimeout(() => navigate('/'), 1200);
  };

  const closeToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

  return (
    <div className="form-page" id="main-content">
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={closeToast} />
      <motion.div
        className="form-card"
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h1>Welcome Back</h1>
        <p className="form-subtitle">Login to your VendorFresh account</p>
        <p style={{ color: 'var(--color-accent-dark)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          ⚠️ Running in Mock Dev Mode (Enter any email & password)
        </p>

        <form onSubmit={handleSubmit} noValidate id="loginForm">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className={`form-input${errors.password ? ' error' : ''}`}
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <motion.button
            type="submit"
            className="btn btn-cart"
            style={{ width: '100%', marginTop: '0.5rem' }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
          >
            Login
          </motion.button>
        </form>

        <p className="form-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {isMockAuth ? (
        <MockLoginForm />
      ) : (
        <div className="form-page" id="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <SignIn signUpUrl="/signup" redirectUrl="/" />
        </div>
      )}
    </motion.div>
  );
}
