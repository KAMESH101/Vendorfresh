import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.message.trim()) errs.message = 'Message is required';
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
    setToast({ visible: true, message: 'Message sent successfully! We\'ll get back to you soon.', type: 'success' });
    setForm({ name: '', email: '', message: '' });
    setErrors({});
  };

  const closeToast = useCallback(() => setToast((t) => ({ ...t, visible: false })), []);

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

      <div className="form-page" id="main-content">
        <motion.div
          className="form-card"
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1>Contact Us</h1>
          <p className="form-subtitle">We'd love to hear from you</p>

          <form onSubmit={handleSubmit} noValidate id="contactForm">
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                className={`form-input${errors.name ? ' error' : ''}`}
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Email</label>
              <input
                id="contact-email"
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
              <label htmlFor="contact-message" className="form-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                className={`form-input${errors.message ? ' error' : ''}`}
                placeholder="Your message..."
                value={form.message}
                onChange={handleChange}
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            <motion.button
              type="submit"
              className="btn btn-cart"
              style={{ width: '100%', marginTop: '0.5rem' }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
