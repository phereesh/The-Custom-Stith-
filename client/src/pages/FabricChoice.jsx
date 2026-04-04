import React, { useEffect, useState } from 'react';
import { Header } from '../components';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SingleBreastedSVG = ({ color }) => (
    <svg viewBox="0 0 200 240" className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
        <path d="M50,40 Q100,0 150,40 Q190,50 190,100 L180,220 L100,230 L20,220 L10,100 Z" fill={color} style={{ transition: 'fill 0.4s ease' }} />
        <path d="M70,20 L100,100 L80,120 Z" fill="rgba(0,0,0,0.3)" />
        <path d="M130,20 L100,100 L120,120 Z" fill="rgba(0,0,0,0.3)" />
        <path d="M70,20 L100,90 L130,20 Z" fill="#ffffff" />
        <path d="M92,40 L108,40 L100,90 Z" fill="#111827" />
        <circle cx="100" cy="140" r="4" fill="#111827" />
        <circle cx="100" cy="170" r="4" fill="#111827" />
        <path d="M100,230 L100,100 M80,140 L100,140 M80,170 L100,170" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
        <path d="M20,220 L100,230 L180,220 L190,100 Q190,50 150,40 Q100,0 50,40 Q10,50 10,100 Z" fill="url(#shadingSB)" style={{ mixBlendMode: "multiply" }} />
        <defs>
            <linearGradient id="shadingSB" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
            </linearGradient>
        </defs>
    </svg>
);

const DoubleBreastedSVG = ({ color }) => (
    <svg viewBox="0 0 200 240" className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
        <path d="M40,40 Q100,-10 160,40 Q200,50 200,110 L190,220 L100,230 L10,220 L0,110 Z" fill={color} style={{ transition: 'fill 0.4s ease' }} />
        <path d="M60,20 L120,110 L80,130 Z" fill="rgba(0,0,0,0.35)" />
        <path d="M140,20 L120,80 L140,100 Z" fill="rgba(0,0,0,0.2)" />
        <path d="M60,20 L120,80 L140,20 Z" fill="#ffffff" />
        <path d="M90,40 L110,40 L120,80 Z" fill="#111827" />

        {/* Double breasted overlap line */}
        <path d="M120,110 L110,230" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />

        {/* 6 buttons for double breasted (3 pairs) */}
        <circle cx="80" cy="130" r="5" fill="#111827" />
        <circle cx="120" cy="130" r="5" fill="#111827" />
        <circle cx="80" cy="165" r="5" fill="#111827" />
        <circle cx="120" cy="165" r="5" fill="#111827" />
        <circle cx="80" cy="200" r="5" fill="#111827" />
        <circle cx="120" cy="200" r="5" fill="#111827" />

        <path d="M10,220 L100,230 L190,220 L200,110 Q200,50 160,40 Q100,-10 40,40 Q0,50 0,110 Z" fill="url(#shadingDB)" style={{ mixBlendMode: "multiply" }} />
        <defs>
            <linearGradient id="shadingDB" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
                <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
            </linearGradient>
        </defs>
    </svg>
);

// Premium Fabric Imagery & Colors - Using stable IDs for reliable React rendering
const FABRIC_DATA = [
    {
        id: 'wool-001',
        name: "Premium Wool",
        image: "/images/fabrics/premium-wool.jpg",
        color: "#1e3a8a", // Navy Blue
        description: "The gold standard for suits. Wool is incredibly versatile, breathable, and drapes beautifully on the body. It naturally resists wrinkling and can be worn year-round depending on the woven weight.",
        benefits: ["Excellent drape and structure", "Wrinkle-resistant", "Temperature regulating"],
        bestFor: "Business suits, Formal wear, Year-round use"
    },
    {
        id: 'cotton-002',
        name: "Breathable Cotton",
        image: "/images/fabrics/breathable-cotton.jpg",
        color: "#f5f5dc", // Beige / Khaki
        description: "A fantastic, lighter-weight alternative to wool. Cotton suits are breathable, crisp, and offer a slightly more casual aesthetic that is perfect for spring and summer events. They are easy to maintain and wear.",
        benefits: ["Highly breathable", "Lightweight feel", "Crisp smart-casual look"],
        bestFor: "Summer weddings, Office casual, Daytime events"
    },
    {
        id: 'linen-003',
        name: "Pure Linen",
        image: "/images/fabrics/pure-linen.jpg",
        color: "#d4d4d8", // Light Grey / Linen
        description: "The ultimate summer fabric. Linen is highly absorbent and completely breathable, keeping you cool in extreme heat. Remember, linen wrinkles easily, which gives it a charming, relaxed 'lived-in' elegance.",
        benefits: ["Maximum breathability", "Distinctive relaxed texture", "Superior heat management"],
        bestFor: "Tropical climates, Destination weddings, Casual chic"
    },
    {
        id: 'tweed-004',
        name: "Heritage Tweed",
        image: "/images/fabrics/heritage-tweed.jpg",
        color: "#78350f", // Brown Tweed
        description: "A heavier, rough-surfaced woolen cloth perfect for the colder months. Tweed is steeped in European heritage, offering phenomenal warmth, rich texture, and a profound sense of vintage tailoring.",
        benefits: ["Exceptional warmth", "Highly durable", "Rich textured appearance"],
        bestFor: "Winter wear, Vintage styling, Countryside events"
    }
];

// Expanded Premium Color Palette for manual selection
const PREMIUM_COLORS = [
    { name: "Royal Blue", hex: "#1e3a8a" },
    { name: "Charcoal", hex: "#374151" },
    { name: "Burgundy", hex: "#7f1d1d" },
    { name: "Forest Green", hex: "#064e3b" },
    { name: "Midnight Black", hex: "#111827" },
    { name: "Silver Grey", hex: "#9ca3af" },
    { name: "Classic Tan", hex: "#92400e" }
];

const FabricChoice = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    // State for the interactive 3D suit preview
    const [selectedFabricId, setSelectedFabricId] = useState(FABRIC_DATA[0].id);
    const [suitColor, setSuitColor] = useState(FABRIC_DATA[0].color);
    const [isSpinning, setIsSpinning] = useState(false);

    // Derived state for the currently selected fabric object
    const selectedFabric = FABRIC_DATA.find(f => f.id === selectedFabricId) || FABRIC_DATA[0];

    // State to toggle between Double and Single breasted 3D Models
    const [suitDesign, setSuitDesign] = useState("Single Breasted");

    const handleFabricClick = (id) => {
        if (selectedFabricId === id) return;
        const newFabric = FABRIC_DATA.find(f => f.id === id);
        setIsSpinning(true);
        setTimeout(() => {
            setSelectedFabricId(id);
            setSuitColor(newFabric.color); // Default to fabric color
            setIsSpinning(false);
        }, 400); 
    };

    const handleColorClick = (hex) => {
        if (suitColor === hex) return;
        setIsSpinning(true);
        setTimeout(() => {
            setSuitColor(hex);
            setIsSpinning(false);
        }, 400);
    };

    const handleDesignClick = (design) => {
        if (suitDesign === design) return;
        setIsSpinning(true);
        setTimeout(() => {
            setSuitDesign(design);
            setIsSpinning(false);
        }, 400);
    };

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-serif text-tailor-gold mb-4">
                        Interactive Fabric Guide
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                        Select a suit design below, then click on any fabric to see how it transforms the 3D model in real-time. We've updated our photos to ensure they always load correctly!
                    </p>

                    {/* Toggle Suit Design */}
                    <div className="flex justify-center flex-wrap gap-4 max-w-md mx-auto mb-10">
                        <button
                            onClick={() => handleDesignClick("Single Breasted")}
                            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 ${suitDesign === "Single Breasted" ? "bg-tailor-gold text-tailor-black scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "bg-tailor-darker text-gray-400 border border-white/10 hover:border-tailor-gold hover:text-white"}`}
                        >
                            Single Breasted
                        </button>
                        <button
                            onClick={() => handleDesignClick("Double Breasted")}
                            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all duration-300 ${suitDesign === "Double Breasted" ? "bg-tailor-gold text-tailor-black scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "bg-tailor-darker text-gray-400 border border-white/10 hover:border-tailor-gold hover:text-white"}`}
                        >
                            Double Breasted
                        </button>
                    </div>

                    {/* Interactive 3D Suit Previewer */}
                    <div className="bg-gradient-to-b from-tailor-darker to-tailor-black p-12 rounded-2xl border border-tailor-gold/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] flex flex-col md:flex-row items-center justify-center gap-16 mb-20 max-w-5xl mx-auto">

                        {/* 3D Animated Suit SVG */}
                        <div className="flex-shrink-0" style={{ perspective: '1000px' }}>
                            <div
                                style={{
                                    transform: isSpinning ? 'rotateY(90deg)' : 'rotateY(0deg)',
                                    transition: 'transform 0.4s ease-in-out'
                                }}
                            >
                                {suitDesign === "Single Breasted" ? (
                                    <SingleBreastedSVG color={suitColor} />
                                ) : (
                                    <DoubleBreastedSVG color={suitColor} />
                                )}
                            </div>
                            <h3 className="text-2xl font-serif text-white mt-6 text-center tracking-wide">
                                {selectedFabric.name} {suitDesign}
                            </h3>

                            {/* Custom Color Swatches */}
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {PREMIUM_COLORS.map((color) => (
                                    <button
                                        key={color.hex}
                                        onClick={() => handleColorClick(color.hex)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 transform hover:scale-125 ${suitColor === color.hex ? 'border-tailor-gold scale-110 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'border-white/20 hover:border-white/50'}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Fabric Selection Swatches */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            {FABRIC_DATA.map((fabric) => (
                                <div
                                    key={fabric.id}
                                    onClick={() => handleFabricClick(fabric.id)}
                                    className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-300 ${selectedFabricId === fabric.id ? 'border-tailor-gold scale-105 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-white/10 hover:border-tailor-gold/50 opacity-70 hover:opacity-100'}`}
                                >
                                    {/* Using unique key on img to force refresh if URL changes */}
                                    <div className="w-full h-24 bg-tailor-darker flex items-center justify-center relative">
                                        <img 
                                            key={`${fabric.id}-${fabric.image}`}
                                            src={fabric.image} 
                                            alt={fabric.name} 
                                            className="w-full h-full object-cover absolute inset-0 text-white text-xs z-10" 
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} 
                                        />
                                        <div className="hidden absolute inset-0 z-0 items-center justify-center text-xs text-gray-400 px-2 text-center">Image failed to load</div>
                                    </div>
                                    <div className="bg-tailor-black py-2 text-center text-sm font-semibold text-white">
                                        {fabric.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-24">
                    {FABRIC_DATA.map((fabric, index) => (
                        <section
                            key={fabric.id}
                            className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
                        >
                            <div className="flex-1 w-full" data-aos={index % 2 !== 0 ? "fade-left" : "fade-right"}>
                                <div className="relative overflow-hidden rounded-xl shadow-2xl border border-tailor-gold/20 aspect-[4/3] group bg-tailor-darker">
                                    <img
                                        key={fabric.image}
                                        src={fabric.image}
                                        alt={fabric.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 z-10 relative"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center text-tailor-gold font-serif text-2xl z-0">
                                        {fabric.name} Pattern
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-tailor-black/80 to-transparent opacity-60 z-20 pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="flex-1" data-aos={index % 2 !== 0 ? "fade-right" : "fade-left"}>
                                <h2 className="text-3xl font-serif text-tailor-gold mb-6">{fabric.name}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    {fabric.description}
                                </p>

                                <div className="bg-tailor-darker rounded-lg p-6 border border-white/5 mb-8 transform hover:-translate-y-1 transition-transform duration-300">
                                    <h4 className="text-white font-semibold mb-4 text-xl">Key Benefits:</h4>
                                    <ul className="space-y-3">
                                        {fabric.benefits.map((benefit, i) => (
                                            <li key={`${fabric.id}-benefit-${i}`} className="flex items-center text-gray-400">
                                                <svg className="w-5 h-5 text-tailor-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="inline-flex items-center bg-tailor-gold/10 text-tailor-gold px-6 py-3 rounded-full font-medium border border-tailor-gold/20">
                                    <span className="mr-2 uppercase tracking-wider text-sm font-bold opacity-80">Best For:</span> {fabric.bestFor}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FabricChoice;
