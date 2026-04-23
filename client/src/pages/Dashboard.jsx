import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const orderStatusColor = (status) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        case 'In Progress':
            return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        case 'Fitting':
            return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
        case 'Completed':
            return 'bg-green-500/20 text-green-300 border-green-500/40';
        case 'Cancelled':
            return 'bg-red-500/20 text-red-300 border-red-500/40';
        default:
            return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
};

const paymentStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-500/20 text-green-300 border-green-500/40';
        case 'Pending':
            return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        case 'Failed':
            return 'bg-red-500/20 text-red-300 border-red-500/40';
        case 'Refunded':
            return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
        default:
            return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
};

const isCancellable = (order) =>
    order.status === 'Pending' && order.paymentStatus !== 'Refunded';

const Dashboard = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const handleCancelOrder = async () => {
        if (!cancelTarget) return;
        try {
            setCancelling(true);
            const res = await axios.post(
                `${BASE_URL}/api/v1/order/cancel/${cancelTarget._id}`,
                { reason: cancelReason },
                { headers: { Authorization: auth.token } }
            );
            if (res?.data?.success) {
                toast.success(res.data.message || 'Order cancelled');
                setOrders((prev) => prev.map((o) => (o._id === cancelTarget._id ? res.data.order : o)));
                setSelectedOrder((prev) => (prev && prev._id === cancelTarget._id ? res.data.order : prev));
                setCancelTarget(null);
                setCancelReason('');
            } else {
                toast.error(res?.data?.message || 'Could not cancel order');
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Cancel failed');
        } finally {
            setCancelling(false);
        }
    };

    useEffect(() => {
        AOS.init();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!auth?.token) return;
            try {
                setLoadingOrders(true);
                const res = await axios.get(`${BASE_URL}/api/v1/order/my-orders`, {
                    headers: { Authorization: auth.token },
                });
                if (res?.data?.success) {
                    setOrders(res.data.orders || []);
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to load your orders');
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [auth?.token]);

    useEffect(() => {
        if (!selectedOrder) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setSelectedOrder(null);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [selectedOrder]);

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

                {/* Exclusive Orders */}
                <div className="mb-16" data-aos="fade-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-serif text-white">My Exclusive Orders</h2>
                        <Link to="/exclusive-collection" className="text-tailor-gold hover:text-white font-semibold transition-colors">
                            + Shop More
                        </Link>
                    </div>

                    {loadingOrders ? (
                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-xl p-8 text-center text-gray-400">
                            Loading…
                        </div>
                    ) : orders.filter((o) => o.isExclusive).length === 0 ? (
                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-xl p-8 text-center text-gray-400">
                            You haven't purchased any items from the Exclusive Collection yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.filter((o) => o.isExclusive).map((o) => (
                                <button
                                    key={o._id}
                                    type="button"
                                    onClick={() => setSelectedOrder(o)}
                                    className="text-left bg-tailor-darker border border-tailor-gold/20 rounded-xl overflow-hidden hover:border-tailor-gold transition-all duration-300 shadow-lg flex flex-col"
                                >
                                    {o.productImage && (
                                        <div className="aspect-square overflow-hidden bg-tailor-black flex items-center justify-center p-3">
                                            <img src={o.productImage} alt={o.productTitle} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                    )}
                                    <div className="p-5 flex-grow">
                                        <div className="flex items-start justify-between mb-3 gap-2">
                                            <div>
                                                <p className="text-tailor-gold text-xs uppercase tracking-wider">{o.productCategory || 'Exclusive'}</p>
                                                <h3 className="text-lg font-serif text-white">{o.productTitle}</h3>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full border text-[10px] font-semibold whitespace-nowrap ${paymentStatusColor(o.paymentStatus)}`}>
                                                {o.paymentStatus}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="text-tailor-gold font-bold">Rs. {Number(o.amount).toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="capitalize">{o.paymentMethod}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span>{o.status}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Placed</span><span>{new Date(o.createdAt).toLocaleDateString()}</span></div>
                                        </div>
                                        {o.status === 'Cancelled' && o.cancelledBy === 'Admin' && o.cancelReason && (
                                            <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                                                <p className="text-red-300 text-[10px] font-bold uppercase tracking-wider mb-1">Cancelled by team</p>
                                                <p className="text-gray-200 text-xs italic line-clamp-2">"{o.cancelReason}"</p>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Suit Orders */}
                <div className="mb-16" data-aos="fade-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-serif text-white">My Suit Orders</h2>
                        <Link to="/build-suit" className="text-tailor-gold hover:text-white font-semibold transition-colors">
                            + New Order
                        </Link>
                    </div>

                    {loadingOrders ? (
                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-xl p-8 text-center text-gray-400">
                            Loading your orders…
                        </div>
                    ) : orders.filter((o) => !o.isExclusive).length === 0 ? (
                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-xl p-8 text-center text-gray-400">
                            You haven't placed any custom suit orders yet. Use the Build Suit wizard to place your first order.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.filter((o) => !o.isExclusive).map((o) => (
                                <button
                                    key={o._id}
                                    type="button"
                                    onClick={() => setSelectedOrder(o)}
                                    className="text-left bg-tailor-darker border border-tailor-gold/20 rounded-xl p-6 hover:border-tailor-gold transition-all duration-300 shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-tailor-gold text-xs uppercase tracking-wider">Order</p>
                                            <h3 className="text-xl font-serif text-white">{o.orderType || 'Full Suit'}</h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${orderStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        {o.suitDesign && o.suitDesign !== 'N/A' && (
                                            <div className="flex justify-between"><span className="text-gray-500">Design</span><span>{o.suitDesign}</span></div>
                                        )}
                                        {o.lapelType && o.lapelType !== 'N/A' && (
                                            <div className="flex justify-between"><span className="text-gray-500">Lapel</span><span>{o.lapelType}</span></div>
                                        )}
                                        <div className="flex justify-between"><span className="text-gray-500">Fabric</span><span>{o.fabricType}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Placed</span><span>{new Date(o.createdAt).toLocaleDateString()}</span></div>
                                    </div>
                                    <p className="text-tailor-gold text-xs mt-4">View measurements →</p>
                                </button>
                            ))}
                        </div>
                    )}
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

            {selectedOrder && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-tailor-darker border border-tailor-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between px-8 py-6 border-b border-tailor-gold/20 sticky top-0 bg-tailor-darker z-10">
                            <div>
                                <h2 className="text-2xl font-serif text-white">{selectedOrder.isExclusive ? selectedOrder.productTitle : (selectedOrder.orderType || 'Full Suit')}</h2>
                                <p className="text-gray-400 text-sm mt-1">Order ID: {selectedOrder._id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                aria-label="Close"
                                className="text-gray-400 hover:text-tailor-gold transition-colors p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            <div className="flex items-center flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${orderStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                                {selectedOrder.isExclusive && (
                                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${paymentStatusColor(selectedOrder.paymentStatus)}`}>
                                        Payment: {selectedOrder.paymentStatus}
                                    </span>
                                )}
                                <span className="text-gray-500 text-sm">Placed {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                            </div>

                            {selectedOrder.status === 'Cancelled' && (selectedOrder.cancelReason || selectedOrder.cancelledBy) && (
                                <div className={`rounded-md p-4 border ${selectedOrder.cancelledBy === 'Admin' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className={`w-5 h-5 ${selectedOrder.cancelledBy === 'Admin' ? 'text-red-300' : 'text-orange-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className={`text-sm font-semibold ${selectedOrder.cancelledBy === 'Admin' ? 'text-red-200' : 'text-orange-200'}`}>
                                            Cancelled by {selectedOrder.cancelledBy === 'Admin' ? 'the team' : 'you'}
                                            {selectedOrder.cancelledAt && ` on ${new Date(selectedOrder.cancelledAt).toLocaleString()}`}
                                        </p>
                                    </div>
                                    {selectedOrder.cancelReason && (
                                        <p className="text-gray-200 text-sm pl-7 italic">"{selectedOrder.cancelReason}"</p>
                                    )}
                                    {selectedOrder.paymentStatus === 'Refunded' && (
                                        <p className="text-orange-300 text-xs pl-7 mt-2">
                                            Refund of Rs. {Number(selectedOrder.amount).toLocaleString('en-IN')} processed
                                            {selectedOrder.refundedAt && ` on ${new Date(selectedOrder.refundedAt).toLocaleString()}`}.
                                        </p>
                                    )}
                                </div>
                            )}

                            {selectedOrder.isExclusive ? (
                                <>
                                    {selectedOrder.productImage && (
                                        <div className="flex justify-center">
                                            <img src={selectedOrder.productImage} alt={selectedOrder.productTitle} className="w-48 h-48 object-cover rounded-xl border border-tailor-gold/20" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Purchase</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div><p className="text-gray-400">Item</p><p className="text-white font-medium">{selectedOrder.productTitle}</p></div>
                                            <div><p className="text-gray-400">Category</p><p className="text-white font-medium">{selectedOrder.productCategory || '—'}</p></div>
                                            <div><p className="text-gray-400">Amount</p><p className="text-tailor-gold font-bold">Rs. {Number(selectedOrder.amount).toLocaleString('en-IN')}</p></div>
                                            <div><p className="text-gray-400">Method</p><p className="text-white font-medium capitalize">{selectedOrder.paymentMethod}</p></div>
                                            {selectedOrder.transactionId && (
                                                <div className="sm:col-span-2"><p className="text-gray-400">Transaction ID</p><p className="text-white font-mono text-xs break-all">{selectedOrder.transactionId}</p></div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div><p className="text-gray-400">Type</p><p className="text-white font-medium">{selectedOrder.orderType || 'Full Suit'}</p></div>
                                            <div><p className="text-gray-400">Fabric</p><p className="text-white font-medium">{selectedOrder.fabricType}</p></div>
                                            {selectedOrder.suitDesign && selectedOrder.suitDesign !== 'N/A' && (
                                                <div><p className="text-gray-400">Design</p><p className="text-white font-medium">{selectedOrder.suitDesign}</p></div>
                                            )}
                                            {selectedOrder.lapelType && selectedOrder.lapelType !== 'N/A' && (
                                                <div><p className="text-gray-400">Lapel</p><p className="text-white font-medium">{selectedOrder.lapelType}</p></div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedOrder.measurements && Object.keys(selectedOrder.measurements).length > 0 && (
                                        <div>
                                            <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Measurements (inches)</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                                {Object.entries(selectedOrder.measurements)
                                                    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
                                                    .map(([k, v]) => (
                                                        <div key={k} className="bg-tailor-black/50 border border-tailor-gold/10 rounded-md px-3 py-2">
                                                            <p className="text-gray-500 text-xs capitalize">{k.replace(/_/g, ' ')}</p>
                                                            <p className="text-white font-medium">{v}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="px-8 py-4 border-t border-tailor-gold/20 flex flex-col sm:flex-row justify-between gap-3 sticky bottom-0 bg-tailor-darker">
                            <div>
                                {isCancellable(selectedOrder) ? (
                                    <button
                                        type="button"
                                        onClick={() => setCancelTarget(selectedOrder)}
                                        className="px-5 py-2 border border-red-500/40 text-red-300 rounded-md hover:bg-red-500/10 transition-all"
                                    >
                                        {selectedOrder.paymentStatus === 'Completed' ? 'Cancel & Refund' : 'Cancel Order'}
                                    </button>
                                ) : selectedOrder.paymentStatus === 'Refunded' ? (
                                    <span className="text-orange-300 text-sm">
                                        Refund of Rs. {Number(selectedOrder.amount).toLocaleString('en-IN')} processed
                                        {selectedOrder.refundedAt && ` on ${new Date(selectedOrder.refundedAt).toLocaleDateString()}`}
                                    </span>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cancelTarget && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => !cancelling && setCancelTarget(null)}
                >
                    <div
                        className="bg-tailor-darker border border-red-500/40 rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-white/10">
                            <h3 className="text-xl font-serif text-white">Cancel this order?</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {cancelTarget.isExclusive ? cancelTarget.productTitle : (cancelTarget.orderType || 'Suit Order')}
                            </p>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm">
                            {cancelTarget.paymentStatus === 'Completed' ? (
                                <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-3 text-orange-200">
                                    A refund of <strong>Rs. {Number(cancelTarget.amount).toLocaleString('en-IN')}</strong> will be initiated to your{' '}
                                    {cancelTarget.paymentMethod === 'khalti' ? 'Khalti wallet' : cancelTarget.paymentMethod === 'esewa' ? 'eSewa wallet' : 'original payment method'}.
                                </div>
                            ) : (
                                <p className="text-gray-300">This order hasn't been paid yet, so no refund is needed.</p>
                            )}
                            <div>
                                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Reason (optional)</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Tell us why you're cancelling…"
                                    rows={3}
                                    className="w-full bg-tailor-black border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-600 focus:border-tailor-gold outline-none resize-none"
                                    maxLength={500}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setCancelTarget(null)}
                                disabled={cancelling}
                                className="px-5 py-2 border border-white/10 text-gray-300 rounded-md hover:bg-white/5 transition-all disabled:opacity-60"
                            >
                                Keep Order
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all disabled:opacity-60"
                            >
                                {cancelling ? 'Cancelling…' : (cancelTarget.paymentStatus === 'Completed' ? 'Cancel & Refund' : 'Cancel Order')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
