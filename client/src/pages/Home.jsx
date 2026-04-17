import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../assets/hero-image.jpg';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      offset: 120,
      once: true
    });
  }, []);

  return (
    <div className="bg-tailor-black min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left" data-aos="fade-right">
            <h1 className="text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              Welcome to <span className="text-tailor-gold">Custom Stitch</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Your premier destination for custom tailoring services.
              We create perfectly fitted garments tailored to your unique style and measurements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="px-8 py-4 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 border-2 border-tailor-gold text-tailor-gold font-semibold rounded-md hover:bg-tailor-gold/10 transition-all duration-300 text-center"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center" data-aos="fade-left">
            <div className="w-full max-w-md">
              <img
                src={heroImage}
                alt="Custom Tailoring"
                className="w-full h-auto rounded-lg shadow-2xl border-2 border-tailor-gold/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-serif text-white text-center mb-16" data-aos="fade-up">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 text-center" data-aos="zoom-in">
            <div className="w-16 h-16 bg-tailor-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Custom Fit</h3>
            <p className="text-gray-400">
              Every garment is tailored to your exact measurements for the perfect fit.
            </p>
          </div>

          <div className="bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 text-center" data-aos="zoom-in" data-aos-delay="100">
            <div className="w-16 h-16 bg-tailor-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Quality Materials</h3>
            <p className="text-gray-400">
              We use only the finest fabrics and materials for lasting quality.
            </p>
          </div>

          <div className="bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 text-center" data-aos="zoom-in" data-aos-delay="200">
            <div className="w-16 h-16 bg-tailor-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Expert Craftsmanship</h3>
            <p className="text-gray-400">
              Skilled tailors with years of experience creating beautiful garments.
            </p>
          </div>
        </div>
      </section>
      {/* Service Options Section */}
      <section className="container mx-auto px-6 py-20 border-t border-tailor-gold/10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-serif text-white mb-4">How We Serve You</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the most convenient way to experience our premium tailoring services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Visit Shop Card */}
          <div className="bg-gradient-to-br from-tailor-darker to-tailor-black border border-tailor-gold/20 rounded-2xl p-10 hover:border-tailor-gold/50 transition-all duration-500 group" data-aos="fade-right">
            <div className="w-20 h-20 bg-tailor-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-3xl font-serif text-white mb-6">Visit Our boutique</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Experience the luxury of personalized tailoring in person. Browse our full range of premium fabrics and get measured by our master tailors.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">New Baneshwor</h4>
                  <p className="text-gray-500 text-sm">Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Kamalbinayak</h4>
                  <p className="text-gray-500 text-sm">Bhaktapur, Nepal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Home Service Card */}
          <div className="bg-gradient-to-br from-tailor-darker to-tailor-black border border-tailor-gold/20 rounded-2xl p-10 hover:border-tailor-gold/50 transition-all duration-500 group" data-aos="fade-left">
            <div className="w-20 h-20 bg-tailor-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-3xl font-serif text-white mb-6">Home Concierge</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Cant come to us? We will come to you with our exclusive home service tailored to your busy schedule.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-4 text-gray-300">
                <svg className="w-5 h-5 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Fabric catalogs brought to your door
              </li>
              <li className="flex items-center gap-4 text-gray-300">
                <svg className="w-5 h-5 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Professional on-site measurements
              </li>
              <li className="flex items-center gap-4 text-gray-300">
                <svg className="w-5 h-5 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Expert style consultation
              </li>
            </ul>
            <Link
              to="/register"
              className="inline-block px-6 py-3 border border-tailor-gold text-tailor-gold font-semibold rounded-md hover:bg-tailor-gold/10 transition-all duration-300"
            >
              Book Home Visit
            </Link>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-tailor-darker border border-tailor-gold/30 rounded-lg p-12 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-serif text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join us today and experience the difference of custom tailoring.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

