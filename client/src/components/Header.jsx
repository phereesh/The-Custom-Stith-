import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [designsOpen, setDesignsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const designsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (designsRef.current && !designsRef.current.contains(e.target)) {
        setDesignsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-tailor-black shadow-lg border-b border-tailor-gold/30 py-4 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-12 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <span className="text-xl sm:text-2xl lg:text-3xl font-serif text-tailor-gold tracking-wide">
            The Custom <span className="text-white font-light">Stitch</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-8 mr-4 border-r border-tailor-gold/20 pr-6">
            <div className="relative" ref={designsRef}>
              <button
                onClick={() => setDesignsOpen((v) => !v)}
                className="flex items-center gap-1 text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium whitespace-nowrap text-sm xl:text-base"
              >
                {t('navSuits')}
                <svg className={`w-4 h-4 transition-transform duration-300 ${designsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {designsOpen && (
                <div className="absolute left-0 mt-3 w-48 bg-tailor-black border border-tailor-gold/30 rounded-md shadow-lg py-2 z-50">
                  <Link to="/suit-designs" onClick={() => setDesignsOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200">{t('navSuits')}</Link>
                  <Link to="/shirt-designs" onClick={() => setDesignsOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200">{t('navShirts')}</Link>
                  <Link to="/pant-designs" onClick={() => setDesignsOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200">{t('navPants')}</Link>
                </div>
              )}
            </div>
            <Link to="/exclusive-collection" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium whitespace-nowrap text-sm xl:text-base">{t('navCollection')}</Link>
            <Link to="/fabrics" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium text-sm xl:text-base">{t('navFabrics')}</Link>
            <Link to="/measurements" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium text-sm xl:text-base">{t('navGuide')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-2 px-3 py-1 border border-tailor-gold/30 rounded-full text-xs font-bold text-tailor-gold hover:bg-tailor-gold/10 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'en' ? 'नेपाली' : 'English'}
            </button>
          {auth?.user ? (
            <div className="flex items-center space-x-4">
              <Link to="/build-suit" className="px-4 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-yellow-500 transition-all duration-300 text-sm xl:text-base">{t('navBuildSuit')}</Link>
              <Link to="/dashboard" className="text-white font-semibold hover:text-tailor-gold transition-all duration-300 text-sm xl:text-base">{t('navDashboard')}</Link>
              {auth.user?.role === 1 && (
                <Link to="/admin/dashboard" className="text-tailor-gold font-semibold hover:text-white transition-all duration-300 text-sm xl:text-base">{t('navAdmin')}</Link>
              )}
              <Link to="/profile" className="text-tailor-gold font-semibold hover:text-white transition-all duration-300 capitalize text-sm xl:text-base whitespace-nowrap">{auth.user?.name}</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-all duration-300 font-medium text-sm xl:text-base">{t('navLogout')}</button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300">{t('navLogin')}</Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-tailor-gold p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-tailor-black border-b border-tailor-gold/30 shadow-2xl py-6 px-8 z-50 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-tailor-gold text-xs uppercase tracking-widest font-bold">Menu</h3>
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
              className="px-3 py-1 border border-tailor-gold/30 rounded-full text-xs font-bold text-tailor-gold"
            >
              {language === 'en' ? 'नेपाली' : 'English'}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-tailor-gold text-xs uppercase tracking-widest font-bold">{t('navSuits')}</h3>
            <Link to="/suit-designs" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg hover:text-tailor-gold pl-4">Suit Designs</Link>
            <Link to="/shirt-designs" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg hover:text-tailor-gold pl-4">Shirt Designs</Link>
            <Link to="/pant-designs" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg hover:text-tailor-gold pl-4">Pant Designs</Link>
          </div>
          <Link to="/exclusive-collection" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg font-medium hover:text-tailor-gold">Exclusive Collection</Link>
          <Link to="/fabrics" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg font-medium hover:text-tailor-gold">Fabrics</Link>
          <Link to="/measurements" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 text-lg font-medium hover:text-tailor-gold">Measurements</Link>
          
          <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
            {auth?.user ? (
              <>
                <Link to="/build-suit" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-tailor-gold text-tailor-black font-bold text-center rounded-md">Build Your Suit</Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-tailor-gold text-center py-2 border border-white/10 rounded">Dashboard</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-tailor-gold text-center py-2 border border-white/10 rounded">Profile</Link>
                </div>
                {auth.user.role === 1 && (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-tailor-gold border border-tailor-gold p-2 rounded text-center">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="text-red-500 font-bold py-2 mt-2">Log Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-tailor-gold text-tailor-black font-bold text-center rounded-md">Log In / Sign Up</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

