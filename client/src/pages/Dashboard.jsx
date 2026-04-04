import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Dashboard = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const features = [
        {
            title: "Measurements Guide",
            description: "Learn how to take accurate measurements for your perfect fit.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            link: "/measurements", // Placeholder route
            color: "bg-blue-900/20"
        },
        {
            title: "Fabric Choice",
            description: "Explore our premium collection of fabrics and materials.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            link: "/fabrics", 
            color: "bg-purple-900/20"
        },
        {
            title: "Suit Designs",
            description: "Discover our exclusive suit styles, lapel types, and customizations.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            link: "/suit-designs", 
            color: "bg-emerald-900/20"
        },
        {
            title: "Shirt Designs",
            description: "Explore our premium shirt collections, from classic to formal styles.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L4 7l8 5 8-5-8-5zM4 12l8 5 8-5M4 17l8 5 8-5" />
                </svg>
            ),
            link: "/shirt-designs",
            color: "bg-amber-900/20"
        },
        {
            title: "Pant Designs",
            description: "Discover our custom-tailored pants, from flat-fronts to heritage Gorkha styles.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-12h1m-1 4h1m-1 4h1" />
                </svg>
            ),
            link: "/pant-designs",
            color: "bg-cyan-900/20"
        },
        {
            title: "Exclusive Collection",
            description: "Explore our curated selection of premium ready-made suits, shirts, and luxury accessories.",
            icon: (
                <svg className="w-12 h-12 text-tailor-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            link: "/exclusive-collection",
            color: "bg-indigo-900/20"
        }
    ];

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-serif text-white mb-2" data-aos="fade-down">Dashboard</h1>
                <p className="text-gray-400 mb-12" data-aos="fade-down" data-aos-delay="100">Welcome to your personal tailoring hub.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <Link
                            to={feature.link}
                            key={index}
                            className={`block ${feature.color} border border-tailor-gold/20 rounded-xl p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-tailor-gold/20 group`}
                            data-aos="zoom-in"
                            data-aos-delay={index * 100}
                        >
                            <div className="bg-tailor-black/50 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-tailor-gold/20 transition-colors duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-tailor-gold transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Build Suit Banner */}
                <div className="bg-gradient-to-r from-tailor-darker to-tailor-black border border-tailor-gold/30 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl" data-aos="fade-up">
                    <div className="md:w-2/3 mb-6 md:mb-0">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-4">Ready for your custom suit?</h2>
                        <p className="text-gray-300 text-lg">Use our interactive step-by-step wizard to design your perfect suit. Select your lapel, choose your premium fabric, and apply your exact body measurements for a masterpiece fit.</p>
                    </div>
                    <div>
                        <Link to="/build-suit" className="inline-block px-8 py-4 bg-tailor-gold text-tailor-black text-xl font-bold rounded-lg hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.4)] tracking-wide">
                            Start Building Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
