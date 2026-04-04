import React, { useEffect } from 'react';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SuitDesigns = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    // High-quality specific image URLs
    const singleBreastedImg = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800";
    const doubleBreastedImg = "/images/suits/double_breasted.png";
    const tuxedoImg = "/images/suits/tuxedo.png";
    const threePieceImg = "/images/suits/three_piece.png";
    const notchLapelImg = "/images/lapels/notch.png";
    const peakLapelImg = "/images/lapels/peak.png";
    const shawlLapelImg = "/images/lapels/shawl.png";

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-serif text-white mb-12 text-center" data-aos="fade-down">
                    Suit Design Guide
                </h1>

                {/* Single Breasted */}
                <section className="mb-20 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1" data-aos="fade-right">
                        <img
                            src={singleBreastedImg}
                            alt="Single Breasted Suit"
                            className="w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20"
                        />
                    </div>
                    <div className="flex-1" data-aos="fade-left">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">Single Breasted Suits</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            A classic choice for any occasion. The single-breasted suit features a jacket with a single column of buttons and a narrow overlap of fabric. It is universally flattering and lengthens the torso, making you appear taller and slimmer.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Versatile styles (1, 2, or 3 buttons)</li>
                            <li>Modern and slimming silhouette</li>
                            <li>Suitable for work, weddings, and casual events</li>
                        </ul>
                    </div>
                </section>

                {/* Double Breasted */}
                <section className="mb-20 flex flex-col lg:flex-row-reverse items-center gap-12">
                    <div className="flex-1" data-aos="fade-left">
                        <img
                            src={doubleBreastedImg}
                            alt="Double Breasted Suit"
                            className="w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20"
                        />
                    </div>
                    <div className="flex-1" data-aos="fade-right">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">Double Breasted Suits</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            The epitome of formal elegance. Double-breasted suits feature two parallel columns of buttons and a wider overlap of fabric. This style adds breadth to the chest and shoulders, creating a commanding and sophisticated presence.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Distinctive 4 or 6 button configuration</li>
                            <li>Broadens the chest and shoulders</li>
                            <li>Ideal for formal events and making a statement</li>
                        </ul>
                    </div>
                </section>

                {/* Tuxedo Suits */}
                <section className="mb-20 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1" data-aos="fade-right">
                        <img
                            src={tuxedoImg}
                            alt="Tuxedo Suit"
                            className="w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20"
                        />
                    </div>
                    <div className="flex-1" data-aos="fade-left">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">Tuxedo (Dinner Suits)</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            The ultimate in evening wear and black-tie events. A tuxedo is distinguished by its satin detailing on the lapels, buttons, and pocket trim, creating an ultra-refined, sharp contrast. It is the pinnacle of formal menswear.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Satin lapels, usually peak or shawl</li>
                            <li>Worn closely fitted to showcase elegance</li>
                            <li>Perfect for galas, prestigious weddings, and black-tie affairs</li>
                        </ul>
                    </div>
                </section>

                {/* Three-Piece Suits */}
                <section className="mb-20 flex flex-col lg:flex-row-reverse items-center gap-12">
                    <div className="flex-1" data-aos="fade-left">
                        <img
                            src={threePieceImg}
                            alt="Three-Piece Suit"
                            className="w-full max-w-md mx-auto rounded-lg shadow-2xl border border-tailor-gold/20"
                        />
                    </div>
                    <div className="flex-1" data-aos="fade-right">
                        <h2 className="text-3xl font-serif text-tailor-gold mb-6">Three-Piece Suits</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Adding a tailored waistcoat (vest) brings depth, texture, and a sense of completeness to your suit. The three-piece suit is highly versatile, allowing you to maintain a sharp, dapper look even when the jacket is removed.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Includes a matching waistcoat</li>
                            <li>Offers a profoundly refined and structured look</li>
                            <li>Versatile styling options (with or without the jacket)</li>
                        </ul>
                    </div>
                </section>

                {/* Lapel Types */}
                <section className="bg-tailor-darker p-8 rounded-xl border border-tailor-gold/20" data-aos="fade-up">
                    <h2 className="text-3xl font-serif text-white mb-8 text-center">Understanding Lapels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-white h-48 mb-4 rounded-lg flex items-center justify-center border border-tailor-gold/10 overflow-hidden relative">
                                <img src={notchLapelImg} alt="Notch Lapel" className="w-full h-full object-contain p-4" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-tailor-gold text-xl font-serif">Notch Lapel</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Notch Lapel</h3>
                            <p className="text-gray-400 text-sm">
                                The most common standard. Features a "notch" where the jacket collar meets the lapel. Perfect for business and everyday suits.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white h-48 mb-4 rounded-lg flex items-center justify-center border border-tailor-gold/10 overflow-hidden relative">
                                <img src={peakLapelImg} alt="Peak Lapel" className="w-full h-full object-contain p-4" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-tailor-gold text-xl font-serif">Peak Lapel</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Peak Lapel</h3>
                            <p className="text-gray-400 text-sm">
                                Edges point upwards towards the shoulders. Highly formal and stylish. Common on double-breasted suits and tuxedos.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-white h-48 mb-4 rounded-lg flex items-center justify-center border border-tailor-gold/10 overflow-hidden relative">
                                <img src={shawlLapelImg} alt="Shawl Lapel" className="w-full h-full object-contain p-4" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-tailor-gold text-xl font-serif">Shawl Lapel</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">Shawl Lapel</h3>
                            <p className="text-gray-400 text-sm">
                                A continuous curve without a notch or peak. Exclusively formal, typically seen on dinner jackets and tuxedos.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SuitDesigns;
