import React, { useEffect } from 'react';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MeasurementGuide = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const measurements = [
    {
      id: 'shoulder',
      title: 'Shoulder Measurement',
      description: 'Run the measuring tape from one shoulder edge to the other across the upper back.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> {/* Head */}
          <path d="M90 60 L110 60 L115 80 L140 90 L130 200 L110 200 L110 130 L90 130 L90 200 L70 200 L60 90 L85 80 Z" fill="currentColor" /> {/* Body */}
          <path d="M60 90 L40 180 L50 180 L70 100 Z" fill="currentColor" /> {/* Left Arm */}
          <path d="M140 90 L160 180 L150 180 L130 100 Z" fill="currentColor" /> {/* Right Arm */}
          
          {/* Measurement Highlight (Shoulder across back) */}
          <line x1="60" y1="90" x2="140" y2="90" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="60" cy="90" r="4" fill="#d4af37" />
          <circle cx="140" cy="90" r="4" fill="#d4af37" />
          
          {/* Arrow */}
          <path d="M55 90 L65 85 L65 95 Z" fill="#d4af37" />
          <path d="M145 90 L135 85 L135 95 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'chest',
      title: 'Chest Measurement',
      description: 'Wrap the measuring tape around the fullest part of your chest, passing exactly under your arms.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> {/* Head */}
          <path d="M90 60 L110 60 L115 80 L140 90 L130 200 L110 200 L110 130 L90 130 L90 200 L70 200 L60 90 L85 80 Z" fill="currentColor" opacity="0.8"/> {/* Body */}
          <path d="M60 90 L40 180 L50 180 L70 100 Z" fill="currentColor" opacity="0.8"/> {/* Left Arm */}
          <path d="M140 90 L160 180 L150 180 L130 100 Z" fill="currentColor" opacity="0.8"/> {/* Right Arm */}
          
          {/* Measurement Highlight (Chest) */}
          <ellipse cx="100" cy="115" rx="36" ry="12" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <path d="M60 115 Q100 135 140 115" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M140 115 L132 108 L138 108 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'suit-length',
      title: 'Suit Length',
      description: 'Measure from the top of your shoulder down to your desired suit length (usually around the thumb knuckle).',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
           {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> 
          <path d="M90 60 L110 60 L115 80 L140 90 L130 250 L110 250 L110 130 L90 130 L90 250 L70 250 L60 90 L85 80 Z" fill="currentColor" /> 
          <path d="M60 90 L40 180 L50 180 L70 100 Z" fill="currentColor" /> 
          <path d="M140 90 L160 180 L150 180 L130 100 Z" fill="currentColor" /> 
          
          {/* Measurement Highlight (Length) */}
          <line x1="125" y1="85" x2="125" y2="200" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="125" cy="85" r="4" fill="#d4af37" />
          <line x1="115" y1="200" x2="135" y2="200" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M125 200 L120 190 L130 190 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'sleeve-length',
      title: 'Sleeve Length',
      description: 'Start the measuring tape from the shoulder point and measure down to the wrist bone.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
           {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> 
          <path d="M90 60 L110 60 L115 80 L140 90 L130 200 L110 200 L110 130 L90 130 L90 200 L70 200 L60 90 L85 80 Z" fill="currentColor" /> 
          <path d="M60 90 L40 180 L50 180 L70 100 Z" fill="currentColor" /> 
          <path d="M140 90 L170 180 L160 180 L130 100 Z" fill="currentColor" /> 
          
          {/* Measurement Highlight (Sleeve) */}
          <line x1="140" y1="90" x2="165" y2="180" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="140" cy="90" r="4" fill="#d4af37" />
          <line x1="155" y1="180" x2="175" y2="180" stroke="#d4af37" strokeWidth="3" />
          
           {/* Arrow */}
          <path d="M165 180 L158 170 L168 168 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
       id: 'waist',
      title: 'Waist Measurement',
      description: 'Wrap the measuring tape around your natural waistline, usually the narrowest part of your torso, just above the belly button.',
      illustration: (
         <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> 
          <path d="M90 60 L110 60 L115 80 L140 90 L130 250 L110 250 L110 130 L90 130 L90 250 L70 250 L60 90 L85 80 Z" fill="currentColor" opacity="0.8"/> 
          <path d="M50 85 L30 170 L40 170 L60 95 Z" fill="currentColor" opacity="0.8"/> 
          <path d="M150 85 L170 170 L160 170 L140 95 Z" fill="currentColor" opacity="0.8"/> 
          
          {/* Measurement Highlight (Waist) */}
          <ellipse cx="100" cy="150" rx="30" ry="8" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <path d="M70 150 Q100 160 130 150" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M130 150 L122 145 L128 145 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
       id: 'hip',
      title: 'Hip Measurement',
      description: 'Wrap the measuring tape around the widest part of your hips and buttocks.',
      illustration: (
         <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Base */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> 
          <path d="M90 60 L110 60 L115 80 L140 90 L130 250 L110 250 L110 130 L90 130 L90 250 L70 250 L60 90 L85 80 Z" fill="currentColor" opacity="0.8"/> 
          <path d="M50 85 L30 170 L40 170 L60 95 Z" fill="currentColor" opacity="0.8"/> 
          <path d="M150 85 L170 170 L160 170 L140 95 Z" fill="currentColor" opacity="0.8"/> 
          
          {/* Measurement Highlight (Hip) */}
          <ellipse cx="100" cy="180" rx="34" ry="10" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <path d="M66 180 Q100 193 134 180" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M134 180 L126 174 L132 174 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'back',
      title: 'Back Measurement',
      description: 'Measure across the upper back from the edge of one armhole to the other.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Base (Back View) */}
          <path d="M100 20 Q120 20 120 40 Q120 60 100 60 Q80 60 80 40 Q80 20 100 20 Z" fill="currentColor" /> 
          <path d="M90 60 L110 60 L115 80 L140 90 L130 200 L110 200 L110 130 L90 130 L90 200 L70 200 L60 90 L85 80 Z" fill="currentColor" /> 
          <path d="M60 90 L40 180 L50 180 L70 100 Z" fill="currentColor" /> 
          <path d="M140 90 L160 180 L150 180 L130 100 Z" fill="currentColor" /> 
          
          {/* Measurement Highlight (Back armhole to armhole) */}
          <path d="M68 110 Q100 120 132 110" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="68" cy="110" r="4" fill="#d4af37" />
          <circle cx="132" cy="110" r="4" fill="#d4af37" />
          
           {/* Arrow */}
          <path d="M63 110 L73 105 L73 115 Z" fill="#d4af37" />
          <path d="M137 110 L127 105 L127 115 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'pant-length',
      title: 'Pant Length',
      description: 'Measure from the top of your waistband down to the bottom of your ankle.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Lower Body */}
          <path d="M70 130 L130 130 L135 280 L105 280 L100 200 L95 280 L65 280 Z" fill="currentColor" />
          
          {/* Measurement Highlight (Waist to Ankle) */}
          <line x1="140" y1="130" x2="140" y2="275" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="140" cy="130" r="4" fill="#d4af37" />
          <circle cx="140" cy="275" r="4" fill="#d4af37" />
          
          {/* Arrows */}
          <path d="M140 130 L135 140 L145 140 Z" fill="#d4af37" />
          <path d="M140 275 L135 265 L145 265 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'pant-waist',
      title: 'Pant Waist',
      description: 'Measure around your waist at the level where you normally wear your pants belt.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Lower Body */}
          <path d="M70 130 L130 130 L135 250 L65 250 Z" fill="currentColor" opacity="0.8" />
          
          {/* Measurement Highlight (Waist Loop) */}
          <ellipse cx="100" cy="140" rx="35" ry="10" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <path d="M65 140 Q100 155 135 140" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M135 140 L128 135 L132 135 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'pant-hip',
      title: 'Pant Hip',
      description: 'Measure around the fullest part of your hips and seat.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Lower Body */}
          <path d="M70 130 L130 130 L138 200 L135 250 L65 250 L62 200 Z" fill="currentColor" opacity="0.8" />
          
          {/* Measurement Highlight (Hip Loop) */}
          <ellipse cx="100" cy="185" rx="40" ry="12" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="5,5" />
          <path d="M60 185 Q100 205 140 185" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M140 185 L132 180 L136 180 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'thigh',
      title: 'Thigh Measurement',
      description: 'Measure around the fullest part of your thigh, usually just below the crotch.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Lower Body/Leg */}
          <path d="M70 130 L130 130 L135 280 L105 280 L100 200 L95 280 L65 280 Z" fill="currentColor" opacity="0.8" />
          
          {/* Measurement Highlight (Thigh Loop) */}
          <ellipse cx="82" cy="210" rx="18" ry="6" fill="none" stroke="#d4af37" strokeWidth="4" strokeDasharray="3,3" />
          <path d="M64 210 Q82 220 100 210" fill="none" stroke="#d4af37" strokeWidth="4" />
          
          {/* Arrow */}
          <path d="M100 210 L92 205 L96 205 Z" fill="#d4af37" />
        </svg>
      )
    },
    {
      id: 'ankle-wide',
      title: 'Ankle Wide',
      description: 'Measure the circumference of the bottom of the pant leg for your desired width.',
      illustration: (
        <svg viewBox="0 0 200 300" className="w-full h-full text-gray-300 drop-shadow-md">
          {/* Mannequin Lower Body/Foot area */}
          <path d="M70 130 L130 130 L135 280 L105 280 L100 200 L95 280 L65 280 Z" fill="currentColor" opacity="0.8" />
          
          {/* Measurement Highlight (Ankle Loop) */}
          <ellipse cx="80" cy="275" rx="15" ry="5" fill="none" stroke="#d4af37" strokeWidth="3" strokeDasharray="2,2" />
          <path d="M65 275 Q80 285 95 275" fill="none" stroke="#d4af37" strokeWidth="3" />
          
          {/* Arrow */}
          <path d="M95 275 L88 270 L92 270 Z" fill="#d4af37" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-tailor-black min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-tailor-black border-b border-tailor-gold/20 py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-tailor-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tailor-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6" data-aos="fade-down">
            Body <span className="text-tailor-gold">Measurement Guide</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed" data-aos="fade-down" data-aos-delay="100">
            A perfectly tailored suit begins with precise measurements. Follow our simple visual guide to correctly measure yourself for the perfect Custom Stitch fit. You will need a soft measuring tape and ideally, a friend to help.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {measurements.map((item, index) => (
            <div 
              key={item.id}
              className="bg-[#111] rounded-2xl p-8 border border-gray-800 hover:border-tailor-gold/50 transition-all duration-300 group flex flex-col items-center shadow-xl hover:-translate-y-2 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={(index % 3) * 100}
            >
              {/* Card Label */}
              <div className="absolute top-4 left-4 bg-tailor-gold/10 text-tailor-gold px-3 py-1 rounded-full text-sm font-semibold tracking-wider">
                Step {index + 1}
              </div>

              {/* Illustration Container */}
              <div className="w-48 h-56 mb-8 relative">
                {/* Subtle background glow for illustration */}
                <div className="absolute inset-0 bg-gradient-to-t from-tailor-gold/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {item.illustration}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-serif text-white mb-4 text-center group-hover:text-tailor-gold transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-400 text-center leading-relaxed text-sm">
                {item.description}
              </p>

              {/* Decorative line */}
              <div className="mt-6 w-12 h-0.5 bg-gray-800 group-hover:bg-tailor-gold/50 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] p-10 rounded-2xl border border-gray-800" data-aos="fade-up">
          <h2 className="text-2xl font-serif text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Once you have your measurements ready, you can explore our suit designs and begin customizing your perfect fit.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/suit-designs" className="px-8 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-white transition-all duration-300">
              Explore Suit Designs
            </a>
            <a href="/dashboard" className="px-8 py-3 bg-transparent border border-gray-600 text-white font-semibold rounded-md hover:border-tailor-gold hover:text-tailor-gold transition-all duration-300">
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementGuide;
