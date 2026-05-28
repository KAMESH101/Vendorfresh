import { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Browse Crops' },
  { to: '/farmers', label: 'Meet Farmers' },
  { to: '/village-heads', label: 'Village Heads' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
}

export default function Navbar({ onCartOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon" aria-hidden="true">🌿</span>
          <span className="navbar-brand-text">VendorFresh</span>
        </Link>

        {/* Desktop Links */}
        <ul className={`navbar-links${mobileOpen ? ' open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.to} style={{ listStyle: 'none' }}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `navbar-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
                end={item.to === '/'}
              >
                {item.label}
                {/* Animated underline */}
                {location.pathname === item.to && !prefersReducedMotion && (
                  <motion.div
                    className="nav-underline"
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {location.pathname === item.to && prefersReducedMotion && (
                  <div className="nav-underline" />
                )}
              </NavLink>
            </li>
          ))}

          {/* Mobile-only auth links */}
          {isAuthenticated && (
            <li style={{ listStyle: 'none' }} className="mobile-auth-link">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `navbar-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                👤 My Profile
              </NavLink>
            </li>
          )}
          <li style={{ listStyle: 'none' }} className="mobile-auth-link">
            {isAuthenticated ? (
              <button
                className="navbar-link"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                style={{ textAlign: 'left', width: '100%' }}
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Login
              </NavLink>
            )}
          </li>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            /* Initials avatar — navigates to /profile */
            <motion.button
              className="navbar-avatar"
              onClick={() => navigate('/profile')}
              aria-label="Go to profile"
              title={`Profile: ${user?.name}`}
              whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
            >
              {getInitials(user?.name)}
            </motion.button>
          ) : (
            /* Login link — visible when not authenticated */
            <Link
              to="/login"
              className="navbar-link"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
              }}
            >
              Login
            </Link>
          )}

          {/* Cart Button */}
          <motion.button
            className="cart-button"
            onClick={onCartOpen}
            aria-label={`Shopping cart with ${cartCount} items`}
            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  className="cart-badge"
                  key="cart-badge"
                  initial={prefersReducedMotion ? {} : { scale: 0 }}
                  animate={prefersReducedMotion ? {} : { scale: 1 }}
                  exit={prefersReducedMotion ? {} : { scale: 0 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Hamburger */}
          <button
            className="hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </nav>
    </>
  );
}
