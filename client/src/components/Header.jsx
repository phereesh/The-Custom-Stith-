import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [designsOpen, setDesignsOpen] = useState(false);
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
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate('/login');
  };


  return (
    <header className="bg-tailor-black shadow-lg border-b border-tailor-gold/30 py-4 sticky top-0 z-50">
      <div className="w-full px-8 lg:px-12 flex justify-between items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          {/* <svg className="w-10 h-10 text-tailor-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2L11,8L10,2H8L7,8L6,2H4L6,10H8L9,4L10,10H12L13,4L14,10H16L18,2H16L15,8L14,2H12M2,12V14H22V12H2M21,16H3L4,22H20L21,16Z"/>
          </svg> */}
          <span className="text-2xl sm:text-3xl font-serif text-tailor-gold tracking-wide">
            The Custom <span className="text-white font-light">Stitch</span>
          </span>
        </Link>



        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-8 mr-4 border-r border-tailor-gold/20 pr-6">
            <div className="relative" ref={designsRef}>
              <button
                onClick={() => setDesignsOpen((v) => !v)}
                className="flex items-center gap-1 text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium whitespace-nowrap"
              >
                Designs
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${designsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {designsOpen && (
                <div className="absolute left-0 mt-3 w-48 bg-tailor-black border border-tailor-gold/30 rounded-md shadow-lg shadow-black/40 py-2 z-50">
                  <Link
                    to="/suit-designs"
                    onClick={() => setDesignsOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200 font-medium"
                  >
                    Suit Designs
                  </Link>
                  <Link
                    to="/shirt-designs"
                    onClick={() => setDesignsOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200 font-medium"
                  >
                    Shirt Designs
                  </Link>
                  <Link
                    to="/pant-designs"
                    onClick={() => setDesignsOpen(false)}
                    className="block px-4 py-2 text-gray-300 hover:text-tailor-gold hover:bg-tailor-gold/10 transition-colors duration-200 font-medium"
                  >
                    Pant Designs
                  </Link>
                </div>
              )}
            </div>
            <Link to="/exclusive-collection" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium whitespace-nowrap">
              Exclusive Collection
            </Link>
            <Link to="/fabrics" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium">
              Fabrics
            </Link>
            <Link to="/measurements" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium">
              Measurements
            </Link>
          </div>

          {auth?.user ? (
            <div className="flex items-center space-x-4">
              <Link to="/build-suit" className="px-5 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                Build Suit
              </Link>
              <Link to="/dashboard" className="text-white font-semibold hover:text-tailor-gold transition-all duration-300 ml-2">
                Dashboard
              </Link>
              {auth.user.role === 1 && (
                <Link to="/admin/dashboard" className="text-tailor-gold font-semibold hover:text-white transition-all duration-300 ml-2">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-tailor-gold font-semibold hover:text-white transition-all duration-300 capitalize ml-4">
                {auth.user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-all duration-300 ml-4 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300"
            >
              Login
            </Link>
          )}
        </nav>
      </div>


    </header>
  );
};

export default Header;

