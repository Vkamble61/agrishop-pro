import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTractor, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaTractor className="footer-logo-icon" />
              <span className="footer-logo-text">AgriShop Pro</span>
            </div>
            <p className="footer-description">
              Empowering farmers with quality agriculture equipment and trusted service since generations. Built on community trust and mechanical engineering excellence.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/equipment">Equipment Catalogue</Link></li>
              <li><Link to="/finance">Finance & EMI</Link></li>
              <li><Link to="/reviews">Customer Reviews</Link></li>
              <li><Link to="/farmer/register">Register as Farmer</Link></li>
            </ul>
          </div>

          {/* For Farmers */}
          <div className="footer-section">
            <h4 className="footer-title">For Farmers</h4>
            <ul className="footer-links">
              <li><Link to="/farmer/login">Farmer Login</Link></li>
              <li><Link to="/farmer/dashboard">My Dashboard</Link></li>
              <li><Link to="/equipment">Browse Equipment</Link></li>
              <li><Link to="/finance">EMI Calculator</Link></li>
              <li><Link to="/reviews">Share Your Experience</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>Your Shop Address<br />City, State - PIN</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>info@agrishoppro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} AgriShop Pro. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">{t('footer.privacy')}</Link>
              <span className="separator">|</span>
              <Link to="/terms">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Made with Bob
