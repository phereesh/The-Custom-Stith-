import React, { useEffect } from 'react';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PantDesigns = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const pantDesigns = [
        {
            title: "Normal Formal Pant (No Crease)",
            description: "A clean, modern look without any front pleats or creases. Perfect for a slim, contemporary silhouette that works for both business and smart-casual settings.",
            image: "/images/pants/normal_pant.jpg",
            features: [
                "Flat front design",
                "Slimming silhouette",
                "Versatile for all occasions",
                "Clean, minimalist aesthetic"
            ],
            aos: "fade-right"
        },
        {
            title: "Single Crease (1 Pleat) Pant",
            description: "A classic choice that adds a single pleat on each side. This provides extra comfort and room in the hip area while maintaining a sharp, professional crease down the leg.",
            image: "/images/pants/one_crease_pant.jpg",
            features: [
                "Single forward or reverse pleat",
                "Extra comfort in the seat",
                "Traditional professional look",
                "Excellent drape"
            ],
            aos: "fade-left"
        },
        {
            title: "Double Crease (2 Pleats) Pant",
            description: "For maximum comfort and a traditional sartorial look. Double pleats offer the most room through the thigh and hip, creating a distinguished and classic drape.",
            image: "/images/pants/two_crease_pant.jpg",
            features: [
                "Double pleat configuration",
                "Maximum mobility and comfort",
                "Classic tailoring heritage",
                "Ideal for a more relaxed fit"
            ],
            aos: "fade-right"
        },
        {
            title: "Gorkha Pant (Side Adjusters)",
            description: "A distinctive design inspired by military heritage. Features a high waist, stripe design details, and side adjusters instead of belt loops. These pants offer a perfect fit without the need for a belt.",
            image: "/images/pants/gorkha_pant.jpg",
            features: [
                "Unique side-buckle adjusters",
                "No belt loops required",
                "High-waisted sophisticated fit",
                "Elegant front crease and stripe detail"
            ],
            aos: "fade-left"
        }
    ];

    return (
        <div className="bg-tailor-black min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-serif text-white mb-4 text-center" data-aos="fade-down">
                    Premium Pant Designs
                </h1>
                <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto" data-aos="fade-down" data-aos-delay="100">
                    Discover our collection of custom-tailored pants, from modern flat-fronts to traditional pleated styles and heritage-inspired Gorkha designs.
                </p>

                <div className="space-y-24">
                    {pantDesigns.map((pant, index) => (
                        <section 
                            key={index} 
                            className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="flex-1 w-full" data-aos={pant.aos}>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-tailor-gold to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/5 shadow-2xl">
                                        <img
                                            src={pant.image}
                                            alt={pant.title}
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full" data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}>
                                <h2 className="text-3xl font-serif text-tailor-gold mb-6">{pant.title}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    {pant.description}
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pant.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center text-gray-400">
                                            <svg className="w-5 h-5 text-tailor-gold mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PantDesigns;
