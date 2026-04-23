import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';

const PaymentFailure = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleDevComplete = async () => {
        if (!auth?.token) {
            toast.error('Please login first');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `${BASE_URL}/api/v1/payment/dev-complete`,
                {},
                { headers: { Authorization: auth.token } }
            );
            if (res?.data?.success) {
                toast.success('Order completed (dev mode)');
                navigate('/dashboard');
            } else {
                toast.error(res?.data?.message || 'Could not complete order');
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Dev complete failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-20 max-w-2xl">
                <div className="bg-tailor-darker border border-red-400/30 rounded-2xl p-10 text-center shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0020.66 17l-6.93-12a2 2 0 00-3.46 0L3.34 17A2 2 0 005.07 19z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-serif text-white mb-3">Payment Cancelled</h1>
                    <p className="text-gray-300 mb-8">
                        Your eSewa payment was not completed. No charges were made.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                        <Link to="/exclusive-collection" className="px-6 py-3 bg-tailor-gold text-tailor-black font-bold rounded-lg hover:bg-yellow-500 transition-all">
                            Back to Collection
                        </Link>
                        <Link to="/dashboard" className="px-6 py-3 border border-tailor-gold/40 text-tailor-gold rounded-lg hover:bg-tailor-gold/10 transition-all">
                            Go to Dashboard
                        </Link>
                    </div>

                    <div className="border-t border-white/10 pt-6 mt-6">
                        <p className="text-xs text-gray-500 mb-3 italic">
                            eSewa sandbox flaky? Use the dev shortcut to complete your most recent
                            pending order without going through eSewa. Server must have
                            <code className="text-tailor-gold/80"> ESEWA_SKIP_STATUS_CHECK=true</code>.
                        </p>
                        <button
                            type="button"
                            onClick={handleDevComplete}
                            disabled={loading}
                            className="px-5 py-2 text-sm border border-dashed border-tailor-gold/40 text-tailor-gold/80 rounded-md hover:bg-tailor-gold/10 transition-all disabled:opacity-60"
                        >
                            {loading ? 'Completing…' : 'Complete order without eSewa (dev only)'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
