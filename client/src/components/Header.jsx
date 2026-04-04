import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

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
      <div className="container mx-auto px-6 flex justify-between items-center">
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
          <div className="hidden md:flex items-center space-x-6 mr-4 border-r border-tailor-gold/20 pr-6">
            <Link to="/suit-designs" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium">
              Suit Designs
            </Link>
            <Link to="/shirt-designs" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium">
              Shirt Designs
            </Link>
            <Link to="/pant-designs" className="text-gray-300 hover:text-tailor-gold transition-colors duration-300 font-medium">
              Pant Designs
            </Link>
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

