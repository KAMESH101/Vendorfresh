import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabaseClient';

/* ── Animation setup ────────────────────────────────────── */
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

const cardVariants = prefersReducedMotion
  ? {}
  : {
      hidden: { opacity: 0, y: 24 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
      }),
    };

/* ── Helpers ────────────────────────────────────────────── */
function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatMemberSince(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function truncate(str, maxLen = 20) {
  if (!str) return '—';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
}

/* ── getDeliveryStatus helper ────────────────────────────── */
function getDeliveryStatus(createdAtStr) {
  const createdDate = new Date(createdAtStr);
  const now = new Date();
  const diffHours = (now - createdDate) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return {
      status: 'Placed',
      label: 'Order Placed & Confirmed',
      description: 'The farmer is harvesting and packing your fresh produce.',
      progress: 33,
      color: '#3b82f6',
      step: 1
    };
  } else if (diffHours < 48) {
    return {
      status: 'In Transit',
      label: 'Out for Delivery / In Transit',
      description: 'Your fresh produce is in transit from the farm to your doorstep.',
      progress: 66,
      color: '#f59e0b',
      step: 2
    };
  } else {
    return {
      status: 'Delivered',
      label: 'Delivered Successfully',
      description: 'Delivered fresh to your home. Enjoy the organic goodness!',
      progress: 100,
      color: '#10b981',
      step: 3
    };
  }
}

/* ── Status badge ───────────────────────────────────────── */
function StatusBadge({ status }) {
  const cls =
    status === 'paid'
      ? 'order-status-badge badge-paid'
      : status === 'failed'
      ? 'order-status-badge badge-failed'
      : 'order-status-badge badge-pending';
  return <span className={cls}>{status}</span>;
}

/* ── Skeleton card ──────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton-line-short" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-medium" />
      <div className="skeleton-line skeleton-line-short" />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Profile() {
  const { user, logout } = useAuth();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('crops');

  /* Extract purchased crops from paid orders */
  const purchasedCrops = [];
  orders.forEach((order) => {
    if (order.payment_status === 'paid') {
      (order.items || []).forEach((item) => {
        purchasedCrops.push({
          ...item,
          order_id: order.id,
          created_at: order.created_at,
          payment_status: order.payment_status,
          razorpay_payment_id: order.razorpay_payment_id,
        });
      });
    }
  });

  /* Fetch orders */
  useEffect(() => {
    async function fetchOrders() {
      setLoadingOrders(true);
      try {
        let fetchedOrders = [];
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('delivery_email', user?.email)
            .order('created_at', { ascending: false });
          if (!error && data) {
            fetchedOrders = data;
          } else if (error) {
            console.warn('Supabase fetch returned error (falling back to local):', error.message);
          }
        } catch (supabaseErr) {
          console.warn('Supabase connection error (falling back to local):', supabaseErr);
        }

        // Merge with local orders that match the logged-in user's email
        const localOrders = JSON.parse(localStorage.getItem('vendorfresh_local_orders') || '[]');
        const matchingLocal = localOrders.filter((o) => o.delivery_email === user?.email);

        // Deduplicate and merge by id/payment_id
        const allOrders = [...fetchedOrders, ...matchingLocal];
        const uniqueOrders = [];
        const seen = new Set();
        for (const order of allOrders) {
          const key = order.id || order.razorpay_payment_id || order.created_at;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueOrders.push(order);
          }
        }

        // Sort desc
        uniqueOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(uniqueOrders);
      } catch (err) {
        console.error('Failed to load profile orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email]);

  /* Logout handler */
  const handleLogout = useCallback(() => {
    logout();
    dispatch({ type: 'CLEAR_CART' });
    navigate('/');
  }, [logout, dispatch, navigate]);

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Page Hero */}
      <div className="page-hero">
        <h1>My Profile</h1>
        <p>Manage your account and view your orders</p>
      </div>

      <div className="container section profile-page" id="main-content">

        {/* ── Section 1: Account Info ─────────────────────── */}
        <motion.section
          className="profile-info-card"
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          aria-label="Account Information"
        >
          <div className="profile-avatar-row">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(user?.name)}
            </div>
            <div className="profile-user-meta">
              <div className="profile-name-row">
                <h2 className="profile-name">{user?.name || 'User'}</h2>
                <UserButton afterSignOutUrl="/" />
              </div>
              <p className="profile-detail">
                <span className="profile-detail-label">Email</span>
                {user?.email || '—'}
              </p>
              <p className="profile-detail">
                <span className="profile-detail-label">Member Since</span>
                {formatMemberSince(user?.joinedAt)}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Section 2: Order History / Purchased Crops ────────────────────── */}
        <motion.section
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          aria-label="Order History and Purchased Crops"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 className="profile-section-title" style={{ margin: 0 }}>My Orders</h2>
            
            {!loadingOrders && orders.length > 0 && (
              <div className="profile-tabs">
                <button 
                  className={`profile-tab-btn ${activeTab === 'crops' ? 'active' : ''}`}
                  onClick={() => setActiveTab('crops')}
                >
                  📦 Purchased Crops
                </button>
                <button 
                  className={`profile-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payments')}
                >
                  🧾 Payment Receipts
                </button>
              </div>
            )}
          </div>

          {loadingOrders ? (
            <div className="profile-orders-list">
              {[0, 1].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="profile-empty-orders">
              <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No orders yet
              </p>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
                Your completed orders and delivery status will appear here.
              </p>
              <Link to="/products" className="btn btn-primary btn-sm">
                Browse Products
              </Link>
            </div>
          ) : activeTab === 'crops' ? (
            /* ── Purchased Crops View ── */
            purchasedCrops.length === 0 ? (
              <div className="profile-empty-orders">
                <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌾</p>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  No active crops
                </p>
                <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
                  Your purchased crops will appear here once payment is confirmed.
                </p>
                <Link to="/products" className="btn btn-primary btn-sm">
                  Browse Crops
                </Link>
              </div>
            ) : (
              <div className="purchased-crops-grid">
                {purchasedCrops.map((crop, i) => {
                  const delivery = getDeliveryStatus(crop.created_at);
                  return (
                    <motion.div
                      key={`${crop.order_id}-${crop.id}-${i}`}
                      className="purchased-crop-card"
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="purchased-crop-img-wrapper">
                        <img 
                          src={crop.image || '/images/Logo.png'} 
                          alt={crop.name} 
                          className="purchased-crop-img"
                        />
                      </div>
                      
                      <div className="purchased-crop-info">
                        <div className="purchased-crop-header">
                          <div>
                            <h3 className="purchased-crop-name">{crop.name}</h3>
                            <p className="purchased-crop-farmer">
                              Grown by {crop.farmer || 'Local Farmer'} in {crop.region || 'Rural India'}
                            </p>
                          </div>
                          <span className="purchased-crop-date">{formatDate(crop.created_at)}</span>
                        </div>

                        <div className="purchased-crop-meta" style={{ marginTop: '0.25rem' }}>
                          <span className="purchased-crop-qty">
                            Quantity: {crop.quantity} {crop.unit || 'units'}
                          </span>
                          <span className="purchased-crop-price" style={{ marginLeft: '1rem' }}>
                            Total Paid: ₹{crop.price * crop.quantity}
                          </span>
                        </div>

                        {/* Delivery Tracker */}
                        <div className="delivery-tracking">
                          <div className="delivery-tracking-header">
                            <span className="delivery-tracking-label">Delivery Status</span>
                            <span 
                              className="delivery-tracking-status" 
                              style={{ color: delivery.color }}
                            >
                              {delivery.label}
                            </span>
                          </div>

                          <div className="delivery-progress-bar-container">
                            <div 
                              className="delivery-progress-bar-fill" 
                              style={{ 
                                width: `${delivery.progress}%`,
                                backgroundColor: delivery.color
                              }}
                            />
                          </div>

                          <div className="delivery-steps">
                            <div className={`delivery-step ${delivery.step >= 1 ? 'completed' : ''} ${delivery.step === 1 ? 'active' : ''}`}>
                              <div className="delivery-step-dot" />
                              <span className="delivery-step-text">Placed</span>
                            </div>
                            <div className={`delivery-step ${delivery.step > 2 ? 'completed' : delivery.step === 2 ? 'active' : ''}`}>
                              <div className="delivery-step-dot" />
                              <span className="delivery-step-text">Shipping</span>
                            </div>
                            <div className={`delivery-step ${delivery.step >= 3 ? 'completed' : ''} ${delivery.step === 3 ? 'active' : ''}`}>
                              <div className="delivery-step-dot" />
                              <span className="delivery-step-text">Delivered</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )
          ) : (
            /* ── Receipts / Payments View ── */
            <div className="profile-orders-list">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  className="profile-order-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="order-card-header">
                    <div>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                      <StatusBadge status={order.payment_status} />
                    </div>
                    <span className="order-total">₹{order.total_amount}</span>
                  </div>

                  <ul className="order-items-list">
                    {(order.items || []).map((item, idx) => (
                      <li key={idx} className="order-item-line">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="order-item-price">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="order-card-footer">
                    <span className="order-payment-id">
                      Payment ID: {truncate(order.razorpay_payment_id, 20)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── Section 3: Account Actions ──────────────────── */}
        <motion.section
          className="profile-actions-card"
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          aria-label="Account Actions"
        >
          <h2 className="profile-section-title">Account</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Signing out will clear your cart and return you to the home page.
          </p>
          <motion.button
            className="btn-danger-outline"
            onClick={handleLogout}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
          >
            🚪 Sign Out
          </motion.button>
        </motion.section>

      </div>
    </motion.div>
  );
}
