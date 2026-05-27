import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>VendorFresh</h3>
          <p>
            Connecting Indian farmers directly with buyers. Fresh produce, fair
            prices, from farm to fork.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/products">Browse Crops</Link>
          <Link to="/farmers">Meet Farmers</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-section">
          <h3>Support</h3>
          <Link to="/contact">Help Center</Link>
          <Link to="/about">Our Mission</Link>
          <Link to="/login">My Account</Link>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <p>Email: hello@vendorfresh.in</p>
          <p>Phone: +91 98765 43210</p>
          <p>Mumbai, Maharashtra, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VendorFresh. All rights reserved. Made with 🌾 in India.</p>
      </div>
    </footer>
  );
}
