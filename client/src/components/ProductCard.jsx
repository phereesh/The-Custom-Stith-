import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';

const USD_TO_NPR = 133;

const ProductCard = ({ product }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const priceNpr = Math.round(product.price * USD_TO_NPR);

    const handleBuy = async () => {
        if (!auth?.token) {
            toast.error('Please login to make a purchase');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${BASE_URL}/api/v1/payment/khalti/initiate`,
                {
                    productId: product.id,
                    productTitle: product.title,
                    productImage: product.image,
                    productCategory: product.category,
                    amount: priceNpr,
                },
                { headers: { Authorization: auth.token } }
            );

            if (!res?.data?.success || !res.data.paymentUrl) {
                toast.error(res?.data?.message || 'Could not start payment');
                setLoading(false);
                return;
            }

            toast.success('Redirecting to Khalti…', { icon: '💜' });
            window.location.href = res.data.paymentUrl;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
        }
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
                    <span className="text-xl font-bold text-tailor-gold">Rs. {priceNpr.toLocaleString('en-IN')}</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-3 group-hover:text-tailor-gold transition-colors duration-300">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 italic">
                    {product.description}
                </p>

                <button
                    onClick={handleBuy}
                    disabled={loading}
                    className="w-full py-3 bg-tailor-gold text-tailor-black font-bold rounded-lg hover:bg-yellow-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Redirecting…
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Buy with Khalti
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
