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

