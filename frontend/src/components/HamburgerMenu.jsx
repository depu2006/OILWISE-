import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/hamburger.css';

export default function HamburgerMenu({ onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    handleNavClick();
  };

  return (
    <>
      <button 
        className="hamburger-toggle"
        aria-label="Toggle menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <NavLink to="/" end onClick={handleNavClick}>Home</NavLink>
          <NavLink to="/tracker" onClick={handleNavClick}>{t('Tracker')}</NavLink>
          <NavLink to="/analytics" onClick={handleNavClick}>{t('Analytics')}</NavLink>
          <NavLink to="/recipes" onClick={handleNavClick}>{t('Recipes')}</NavLink>
          <NavLink to="/campaigns" onClick={handleNavClick}>{t('Campaigns')}</NavLink>
          <NavLink to="/rewards" onClick={handleNavClick}>{t('Rewards')}</NavLink>
          <NavLink to="/verify" onClick={handleNavClick}>{t('Verify')}</NavLink>
          
          <div className="mobile-menu-separator"></div>
          
          <div className="mobile-menu-languages">
            <button onClick={() => handleLanguageChange('en')} className={i18n.language === 'en' ? 'active' : ''}>
              EN
            </button>
            <button onClick={() => handleLanguageChange('hi')} className={i18n.language === 'hi' ? 'active' : ''}>
              हिं
            </button>
          </div>
        </div>
      </nav>

      {isOpen && <div className="mobile-menu-overlay" onClick={handleNavClick}></div>}
    </>
  );
}