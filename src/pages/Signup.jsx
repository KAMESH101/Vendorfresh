import { motion } from 'framer-motion';
import { SignUp } from '@clerk/clerk-react';
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

export default function Signup() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get('from') || '/';
  const signInUrl = from !== '/' ? `/login?from=${encodeURIComponent(from)}` : '/login';

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="form-page" id="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <SignUp signInUrl={signInUrl} fallbackRedirectUrl={from} />
      </div>
    </motion.div>
  );
}
