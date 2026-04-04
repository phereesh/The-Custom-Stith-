import React from 'react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const handleBuy = () => {
        toast.success(`Succesfully added ${product.title} to your order! Payment feature coming soon.`, {
            duration: 4000,
            icon: '👔',
            style: {
                borderRadius: '10px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #3b82f6',
            },
        });
    };

    return (
        <div className="bg-tailor-darker border border-white/10 rounded-xl overflow-hidden hover:border-tailor-gold/50 transition-all duration-300 group shadow-lg flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-tailor-black flex items-center justify-center p-4">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-700" 
                />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-tailor-gold/60">{product.category}</span>
                    <span className="text-xl font-bold text-tailor-gold">${product.price}</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-3 group-hover:text-tailor-gold transition-colors duration-300">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 italic">
                    {product.description}
                </p>
                
                <button 
                    onClick={handleBuy}
                    className="w-full py-3 bg-tailor-gold text-tailor-black font-bold rounded-lg hover:bg-yellow-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
