import { motion } from 'framer-motion';
import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

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

const reasonMessages = {
  'add-to-cart': '🛒 Please sign in to add items to your cart.',
  'checkout': '🔒 Please sign in to place your order.',
};

export default function Login() {
  const location = useLocation();
  const reason = location.state?.reason;
  const from = location.state?.from || '/';
  const message = reasonMessages[reason];
  const signUpUrl = from !== '/' ? `/signup?from=${encodeURIComponent(from)}` : '/signup';

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div
        className="form-page"
        id="main-content"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' }}
      >
        {message && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginBottom: '1.5rem',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(45,106,79,0.3)',
            }}
          >
            {message}
          </motion.div>
        )}
        <SignIn signUpUrl={signUpUrl} fallbackRedirectUrl={from} />
      </div>
    </motion.div>
  );
}
