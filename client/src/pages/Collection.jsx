import React, { useEffect, useState } from 'react';
import { Header, ProductCard } from '../components';
import { readyMadeProducts, accessories } from '../data/products';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Collection = () => {
    const [filter, setFilter] = useState('All');
    const allProducts = [...readyMadeProducts, ...accessories];
    
    useEffect(() => {
        AOS.init();
    }, []);

    const filteredProducts = filter === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.category === filter || (filter === 'Ready-made' && readyMadeProducts.find(rm => rm.id === p.id)) || (filter === 'Accessories' && accessories.find(acc => acc.id === p.id)));

    const categories = ['All', 'Suits', 'Shirts', 'Pants', 'Ties', 'Cufflinks', 'Brooches', 'Bow Tie'];

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <div className="mb-12 text-center" data-aos="fade-down">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Exclusive Collection</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">
                        A curated selection of premium ready-to-wear garments and luxury suit accessories.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium ${filter === cat ? 'bg-tailor-gold text-tailor-black border-tailor-gold shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-white/10 text-gray-400 hover:border-tailor-gold/50 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product, index) => (
                        <div key={product.id} data-aos="zoom-in" data-aos-delay={(index % 4) * 100}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No items found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;
