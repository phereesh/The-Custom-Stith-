import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';

const PaymentSuccess = () => {
    const { auth } = useAuth();
    const [params] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying | success | failed
    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const encodedData = params.get('data');
        if (!encodedData) {
            setStatus('failed');
            setMessage('Missing payment response from eSewa.');
            return;
        }
        if (!auth?.token) {
            setStatus('failed');
            setMessage('You must be logged in to verify the payment.');
            return;
        }

        let cancelled = false;
        const verify = async () => {
            try {
                const res = await axios.post(
                    `${BASE_URL}/api/v1/payment/verify`,
                    { encodedData },
                    { headers: { Authorization: auth.token } }
                );
                if (cancelled) return;
                if (res?.data?.success) {
                    setStatus('success');
                    setOrder(res.data.order);
                } else {
                    setStatus('failed');
                    setOrder(res?.data?.order || null);
                    setMessage(res?.data?.message || 'Payment verification failed');
                }
            } catch (e) {
                if (cancelled) return;
                console.log(e);
                setStatus('failed');
                setMessage(e?.response?.data?.message || 'Could not verify payment');
            }
        };
        verify();
        return () => { cancelled = true; };
    }, [params, auth?.token]);

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-20 max-w-2xl">
                <div className="bg-tailor-darker border border-tailor-gold/30 rounded-2xl p-10 text-center shadow-2xl">
                    {status === 'verifying' && (
                        <>
                            <div className="w-16 h-16 border-4 border-tailor-gold/30 border-t-tailor-gold rounded-full animate-spin mx-auto mb-6"></div>
                            <h1 className="text-2xl font-serif text-white mb-2">Verifying your payment…</h1>
                            <p className="text-gray-400">Please wait while we confirm your transaction with eSewa.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-serif text-white mb-3">Payment Successful</h1>
                            <p className="text-gray-300 mb-6">
                                Thank you! Your order has been placed successfully.
                            </p>

                            {order && (
                                <div className="bg-tailor-black/50 border border-tailor-gold/20 rounded-xl p-6 text-left mb-8 space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Item</span><span className="text-white font-medium">{order.productTitle}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="text-tailor-gold font-bold">Rs. {Number(order.amount).toLocaleString('en-IN')}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="text-white font-mono text-xs break-all">{order.transactionId || order.transactionUuid}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="text-white font-mono text-xs break-all">{order._id}</span></div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/dashboard" className="px-6 py-3 bg-tailor-gold text-tailor-black font-bold rounded-lg hover:bg-yellow-500 transition-all">
                                    View My Orders
                                </Link>
                                <Link to="/exclusive-collection" className="px-6 py-3 border border-tailor-gold/40 text-tailor-gold rounded-lg hover:bg-tailor-gold/10 transition-all">
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-serif text-white mb-3">Verification Failed</h1>
                            <p className="text-gray-300 mb-8">{message || 'We could not verify your payment.'}</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/exclusive-collection" className="px-6 py-3 bg-tailor-gold text-tailor-black font-bold rounded-lg hover:bg-yellow-500 transition-all">
                                    Try Again
                                </Link>
                                <Link to="/dashboard" className="px-6 py-3 border border-tailor-gold/40 text-tailor-gold rounded-lg hover:bg-tailor-gold/10 transition-all">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
