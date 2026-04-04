import React, { useEffect } from 'react';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ShirtDesigns = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    // Placeholder image URLs - User should replace these with their own images in /images/shirts/
    const normalShirtImg = "/images/shirts/normal_shirt.jpg";
    const cufflinksShirtImg = "/images/shirts/cufflinks_shirt.jpg";

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-serif text-white mb-12 text-center" data-aos="fade-down">
                    Premium Shirt Designs
                </h1>

                {/* Normal Shirt Design */}
                <section className="mb-20 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1" data-aos="fade-right">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-tailor-gold to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src={normalShirtImg}
                                alt="Normal Shirt Design"
                                className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20 transform transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                    <div className="flex-1" data-aos="fade-left">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">Normal Shirt Design</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            A classic, versatile design for everyday elegance. This shirt features standard button-down cuffs and a clean, sharp silhouette that transitions perfectly from professional environments to casual outings.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-3">
                            <li>Classic single or double-button barrel cuffs</li>
                            <li>Universally flattering fit and collar styles</li>
                            <li>Available in a wide range of premium fabrics</li>
                            <li>Perfect for both business and leisure</li>
                        </ul>
                    </div>
                </section>

                <div className="h-px bg-gradient-to-r from-transparent via-tailor-gold/30 to-transparent my-20"></div>

                {/* Cufflinks Design Shirt */}
                <section className="mb-20 flex flex-col lg:flex-row-reverse items-center gap-12">
                    <div className="flex-1" data-aos="fade-left">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-tailor-gold to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src={cufflinksShirtImg}
                                alt="Cufflinks Shirt Design"
                                className="relative w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20 transform transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                    <div className="flex-1" data-aos="fade-right">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">French Cuff (Cufflinks) Design</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            The pinnacle of formal shirt-making. French cuffs are extra-long and folded back, requiring cufflinks for closure. This design adds a layer of sophistication and personal expression to your ensemble, making it ideal for formal events and black-tie occasions.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-3">
                            <li>Elegant double cuffs for a structured look</li>
                            <li>Designed explicitly to showcase your favorite cufflinks</li>
                            <li>Highly recommended for high-profile weddings and galas</li>
                            <li>Pairs exquisitely with our custom tuxedos and three-piece suits</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ShirtDesigns;
