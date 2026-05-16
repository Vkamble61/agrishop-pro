import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTractor, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Will be managed by auth context later

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    // Clear auth token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <FaTractor className="logo-icon" />
            <span className="logo-text">AgriShop Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">{t('nav.home')}</Link>
            <Link to="/equipment" className="nav-link">{t('nav.equipment')}</Link>
            <Link to="/finance" className="nav-link">{t('nav.finance')}</Link>
            <Link to="/reviews" className="nav-link">{t('nav.reviews')}</Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Language Toggle */}
            <button 
              className="language-toggle" 
              onClick={toggleLanguage}
              title={i18n.language === 'en' ? 'हिंदी' : 'English'}
            >
              <FaGlobe />
              <span>{i18n.language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="user-menu">
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'} className="btn btn-primary btn-sm">
                  {t('nav.dashboard')}
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/farmer/login" className="btn btn-outline btn-sm">
                  {t('nav.login')}
                </Link>
                <Link to="/farmer/register" className="btn btn-primary btn-sm">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-link" onClick={toggleMenu}>
              {t('nav.home')}
            </Link>
            <Link to="/equipment" className="mobile-link" onClick={toggleMenu}>
              {t('nav.equipment')}
            </Link>
            <Link to="/finance" className="mobile-link" onClick={toggleMenu}>
              {t('nav.finance')}
            </Link>
            <Link to="/reviews" className="mobile-link" onClick={toggleMenu}>
              {t('nav.reviews')}
            </Link>
            
            <div className="mobile-divider"></div>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard'} 
                  className="mobile-link" 
                  onClick={toggleMenu}
                >
                  {t('nav.dashboard')}
                </Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="mobile-link">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/farmer/login" className="mobile-link" onClick={toggleMenu}>
                  {t('nav.login')}
                </Link>
                <Link to="/farmer/register" className="mobile-link" onClick={toggleMenu}>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// Made with Bob
