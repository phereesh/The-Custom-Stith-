import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';

const VISIT_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const ORDER_STATUSES = ['Pending', 'In Progress', 'Fitting', 'Completed', 'Cancelled'];

const visitStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        case 'Confirmed': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        case 'Completed': return 'bg-green-500/20 text-green-300 border-green-500/40';
        case 'Cancelled': return 'bg-red-500/20 text-red-300 border-red-500/40';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
};

const orderStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        case 'In Progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
        case 'Fitting': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
        case 'Completed': return 'bg-green-500/20 text-green-300 border-green-500/40';
        case 'Cancelled': return 'bg-red-500/20 text-red-300 border-red-500/40';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
};

const paymentStatusColor = (status) => {
    switch (status) {
        case 'Completed': return 'bg-green-500/20 text-green-300 border-green-500/40';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        case 'Failed': return 'bg-red-500/20 text-red-300 border-red-500/40';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
};

const formatDate = (iso) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

const EyeButton = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        title="View details"
        aria-label="View details"
        className="p-2 rounded-md border border-tailor-gold/30 text-tailor-gold hover:bg-tailor-gold/10 hover:border-tailor-gold transition-all duration-300"
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    </button>
);

const AdminDashboard = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [tab, setTab] = useState('visits');

    const [visits, setVisits] = useState([]);
    const [loadingVisits, setLoadingVisits] = useState(true);
    const [visitFilter, setVisitFilter] = useState('All');
    const [selectedVisit, setSelectedVisit] = useState(null);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orderFilter, setOrderFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchVisits = useCallback(async () => {
        try {
            setLoadingVisits(true);
            const res = await axios.get(`${BASE_URL}/api/v1/home-visit/all`, {
                headers: { Authorization: auth?.token },
            });
            if (res?.data?.success) setVisits(res.data.visits || []);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching home visits');
        } finally {
            setLoadingVisits(false);
        }
    }, [auth?.token]);

    const fetchOrders = useCallback(async () => {
        try {
            setLoadingOrders(true);
            const res = await axios.get(`${BASE_URL}/api/v1/order/all`, {
                headers: { Authorization: auth?.token },
            });
            if (res?.data?.success) setOrders(res.data.orders || []);
        } catch (error) {
            console.log(error);
            toast.error('Error fetching suit orders');
        } finally {
            setLoadingOrders(false);
        }
    }, [auth?.token]);

    useEffect(() => {
        if (!auth?.token) {
            toast.error('Please login as admin');
            navigate('/login');
            return;
        }
        if (auth?.user?.role !== 1) {
            toast.error('Admin access only');
            navigate('/dashboard');
            return;
        }
        fetchVisits();
        fetchOrders();
    }, [auth, navigate, fetchVisits, fetchOrders]);

    useEffect(() => {
        if (!selectedVisit && !selectedOrder) return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setSelectedVisit(null);
                setSelectedOrder(null);
            }
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [selectedVisit, selectedOrder]);

    const handleVisitStatusChange = async (id, status) => {
        try {
            const res = await axios.put(
                `${BASE_URL}/api/v1/home-visit/status/${id}`,
                { status },
                { headers: { Authorization: auth?.token } }
            );
            if (res?.data?.success) {
                toast.success('Status updated');
                setVisits((prev) => prev.map((v) => (v._id === id ? { ...v, status } : v)));
                setSelectedVisit((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
            }
        } catch (error) {
            console.log(error);
            toast.error('Error updating status');
        }
    };

    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancellingAdmin, setCancellingAdmin] = useState(false);

    const handleOrderStatusChange = async (id, status) => {
        // Cancellation requires a reason — open the modal instead of firing the request.
        if (status === 'Cancelled') {
            const target = orders.find((o) => o._id === id);
            if (target && target.status !== 'Cancelled') {
                setCancelTarget(target);
                setCancelReason('');
                return;
            }
        }
        try {
            const res = await axios.put(
                `${BASE_URL}/api/v1/order/status/${id}`,
                { status },
                { headers: { Authorization: auth?.token } }
            );
            if (res?.data?.success) {
                toast.success('Order status updated');
                setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
                setSelectedOrder((prev) => (prev && prev._id === id ? res.data.order : prev));
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Error updating order status');
        }
    };

    const submitAdminCancel = async () => {
        if (!cancelTarget) return;
        const trimmed = cancelReason.trim();
        if (!trimmed) {
            toast.error('Please provide a reason for the customer');
            return;
        }
        try {
            setCancellingAdmin(true);
            const res = await axios.put(
                `${BASE_URL}/api/v1/order/status/${cancelTarget._id}`,
                { status: 'Cancelled', reason: trimmed },
                { headers: { Authorization: auth?.token } }
            );
            if (res?.data?.success) {
                toast.success(res.data.message || 'Order cancelled');
                setOrders((prev) => prev.map((o) => (o._id === cancelTarget._id ? res.data.order : o)));
                setSelectedOrder((prev) => (prev && prev._id === cancelTarget._id ? res.data.order : prev));
                setCancelTarget(null);
                setCancelReason('');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Cancel failed');
        } finally {
            setCancellingAdmin(false);
        }
    };

    const suitOrders = orders.filter((o) => !o.isExclusive);
    const exclusiveOrders = orders.filter((o) => o.isExclusive);
    const filteredVisits = visitFilter === 'All' ? visits : visits.filter((v) => v.status === visitFilter);
    const filteredOrders = orderFilter === 'All' ? suitOrders : suitOrders.filter((o) => o.status === orderFilter);
    const exclusiveRevenue = exclusiveOrders
        .filter((o) => o.paymentStatus === 'Completed')
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <div className="mb-12 relative overflow-hidden bg-gradient-to-r from-tailor-darker to-[#1a1a1a] p-8 rounded-3xl border border-tailor-gold/20 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-tailor-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Command <span className="text-tailor-gold">Center</span></h1>
                    <p className="text-gray-400">Executive overview of appointments and bespoke orders.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
                        <div className="bg-tailor-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Revenue</p>
                            <p className="text-3xl font-serif text-white">Rs. {exclusiveRevenue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-tailor-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Pending Visits</p>
                            <p className="text-3xl font-serif text-tailor-gold">{visits.filter(v => v.status === 'Pending').length}</p>
                        </div>
                        <div className="bg-tailor-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Active Orders</p>
                            <p className="text-3xl font-serif text-white">{orders.filter(o => o.status === 'In Progress' || o.status === 'Fitting').length}</p>
                        </div>
                        <div className="bg-tailor-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Efficiency</p>
                            <p className="text-3xl font-serif text-green-400">94%</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-8 border-b border-tailor-gold/20">
                    <button
                        type="button"
                        onClick={() => setTab('visits')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                            tab === 'visits'
                                ? 'text-tailor-gold border-b-2 border-tailor-gold'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Home Visits
                        <span className="ml-2 text-xs bg-tailor-gold/20 text-tailor-gold px-2 py-0.5 rounded-full">{visits.length}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('orders')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                            tab === 'orders'
                                ? 'text-tailor-gold border-b-2 border-tailor-gold'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Suit Orders
                        <span className="ml-2 text-xs bg-tailor-gold/20 text-tailor-gold px-2 py-0.5 rounded-full">{suitOrders.length}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('exclusive')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                            tab === 'exclusive'
                                ? 'text-tailor-gold border-b-2 border-tailor-gold'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Exclusive Orders
                        <span className="ml-2 text-xs bg-tailor-gold/20 text-tailor-gold px-2 py-0.5 rounded-full">{exclusiveOrders.length}</span>
                    </button>
                </div>

                {tab === 'visits' && (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                {['All', ...VISIT_STATUSES].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setVisitFilter(s)}
                                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 ${
                                            visitFilter === s
                                                ? 'bg-tailor-gold text-tailor-black border-tailor-gold'
                                                : 'border-white/10 text-gray-400 hover:border-tailor-gold hover:text-white'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="text-gray-500 text-xs flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-tailor-gold animate-pulse"></span>
                                Live Appointment Feed
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {VISIT_STATUSES.map((s) => (
                                <div key={s} className="bg-tailor-darker border border-tailor-gold/20 rounded-lg p-5">
                                    <p className="text-gray-400 text-sm mb-1">{s}</p>
                                    <p className="text-3xl font-serif text-tailor-gold">
                                        {visits.filter((v) => v.status === s).length}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-2xl overflow-hidden">
                            {loadingVisits ? (
                                <div className="p-10 text-center text-gray-400">Loading home visits…</div>
                            ) : filteredVisits.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">
                                    No home visit requests {visitFilter !== 'All' ? `with status "${visitFilter}"` : 'yet'}.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-tailor-black/60 text-tailor-gold text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4">Contact</th>
                                                <th className="px-6 py-4">Location</th>
                                                <th className="px-6 py-4">Scheduled</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Update</th>
                                                <th className="px-6 py-4">View</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-200 text-sm">
                                            {filteredVisits.map((v) => (
                                                <tr key={v._id} className="border-t border-tailor-gold/10 hover:bg-tailor-black/40 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-white">{v.name}</p>
                                                        <p className="text-gray-400 text-xs">{v.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${v.serviceType === 'Shop Visit' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                            {v.serviceType || 'Home'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono">{v.contact}</td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <p className="truncate">{v.address || 'Showroom'}</p>
                                                        <p className="text-gray-500 text-[10px] uppercase tracking-tight">{v.city}</p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <p className="font-semibold text-gray-300">{v.preferredDate}</p>
                                                        <p className="text-gray-500 text-xs">{v.preferredTime}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${visitStatusColor(v.status)}`}>
                                                            {v.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={v.status}
                                                            onChange={(e) => handleVisitStatusChange(v._id, e.target.value)}
                                                            className="bg-[#1a1a1a] border border-white/5 text-gray-300 rounded-lg px-2 py-1.5 text-xs focus:border-tailor-gold outline-none cursor-pointer hover:bg-[#222] transition-colors"
                                                        >
                                                            {VISIT_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <EyeButton onClick={() => setSelectedVisit(v)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'orders' && (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                {['All', ...ORDER_STATUSES].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setOrderFilter(s)}
                                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 ${
                                            orderFilter === s
                                                ? 'bg-tailor-gold text-tailor-black border-tailor-gold'
                                                : 'border-white/10 text-gray-400 hover:border-tailor-gold hover:text-white'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            {ORDER_STATUSES.map((s) => (
                                <div key={s} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-tailor-gold/20 transition-all duration-300 group">
                                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 group-hover:text-tailor-gold transition-colors">{s}</p>
                                    <p className="text-3xl font-serif text-white">
                                        {orders.filter((o) => o.status === s && !o.isExclusive).length}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-2xl overflow-hidden shadow-2xl">
                            {loadingOrders ? (
                                <div className="p-20 text-center text-gray-500 animate-pulse">Synchronizing order database…</div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="p-20 text-center text-gray-500">
                                    No suit orders {orderFilter !== 'All' ? `marked as "${orderFilter}"` : 'found'}.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-tailor-black/60 text-tailor-gold text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4">Design</th>
                                                <th className="px-6 py-4">Fabric</th>
                                                <th className="px-6 py-4">Placed</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Actions</th>
                                                <th className="px-6 py-4">View</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-200 text-sm">
                                            {filteredOrders.map((o) => (
                                                <tr key={o._id} className="border-t border-tailor-gold/10 hover:bg-tailor-black/40 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-white">{o.user?.name || '—'}</p>
                                                        <p className="text-gray-400 text-xs">{o.user?.email || '—'}</p>
                                                    </td>
                                                    <td className="px-6 py-4">{o.orderType || 'Full Suit'}</td>
                                                    <td className="px-6 py-4">
                                                        <p>{o.suitDesign && o.suitDesign !== 'N/A' ? o.suitDesign : '—'}</p>
                                                        <p className="text-gray-400 text-xs">{o.lapelType && o.lapelType !== 'N/A' ? o.lapelType : ''}</p>
                                                    </td>
                                                    <td className="px-6 py-4">{o.fabricType}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${orderStatusColor(o.status)}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={o.status}
                                                            onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                                                            className="bg-tailor-black border border-tailor-gold/30 text-white rounded-md px-3 py-2 text-sm focus:border-tailor-gold outline-none"
                                                        >
                                                            {ORDER_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <EyeButton onClick={() => setSelectedOrder(o)} />
                                                            {o.status !== 'Cancelled' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setCancelTarget(o); setCancelReason(''); }}
                                                                    title="Cancel order"
                                                                    aria-label="Cancel order"
                                                                    className="p-2 rounded-md border border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === 'exclusive' && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-tailor-gold/20 transition-all">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-tailor-gold transition-colors">Digital Revenue</span>
                                <p className="text-3xl font-serif text-white mt-1">Rs. {exclusiveRevenue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-green-500/20 transition-all">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-green-400 transition-colors">Success Rate</span>
                                <p className="text-3xl font-serif text-green-400 mt-1">
                                    {exclusiveOrders.length > 0 ? ((exclusiveOrders.filter(o => o.paymentStatus === 'Completed').length / exclusiveOrders.length) * 100).toFixed(0) : 0}%
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-yellow-500/20 transition-all">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-yellow-400 transition-colors">Awaiting Funds</span>
                                <p className="text-3xl font-serif text-yellow-400 mt-1">{exclusiveOrders.filter((o) => o.paymentStatus === 'Pending').length}</p>
                            </div>
                            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-red-500/20 transition-all">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-red-400 transition-colors">Failed Trans.</span>
                                <p className="text-3xl font-serif text-red-400 mt-1">{exclusiveOrders.filter((o) => o.paymentStatus === 'Failed').length}</p>
                            </div>
                        </div>

                        <div className="bg-tailor-darker border border-tailor-gold/20 rounded-2xl overflow-hidden">
                            {loadingOrders ? (
                                <div className="p-10 text-center text-gray-400">Loading exclusive orders…</div>
                            ) : exclusiveOrders.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">No exclusive purchases yet.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-tailor-black/60 text-tailor-gold text-sm uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Item</th>
                                                <th className="px-6 py-4">Size</th>
                                                <th className="px-6 py-4">Amount</th>
                                                <th className="px-6 py-4">Method</th>
                                                <th className="px-6 py-4">Payment</th>
                                                <th className="px-6 py-4">Placed</th>
                                                <th className="px-6 py-4">View</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-200 text-sm">
                                            {exclusiveOrders.map((o) => (
                                                <tr key={o._id} className="border-t border-tailor-gold/10 hover:bg-tailor-black/40 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-white">{o.user?.name || '—'}</p>
                                                        <p className="text-gray-400 text-xs">{o.user?.email || '—'}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {o.productImage && (
                                                                <img src={o.productImage} alt={o.productTitle} className="w-12 h-12 object-cover rounded-md border border-tailor-gold/20" />
                                                            )}
                                                            <p className="font-medium text-white">{o.productTitle}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                                                            {o.size || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-tailor-gold font-bold">Rs. {Number(o.amount).toLocaleString('en-IN')}</td>
                                                    <td className="px-6 py-4 capitalize">{o.paymentMethod}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${paymentStatusColor(o.paymentStatus)}`}>
                                                            {o.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <EyeButton onClick={() => setSelectedOrder(o)} />
                                                            {o.status !== 'Cancelled' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setCancelTarget(o); setCancelReason(''); }}
                                                                    title="Cancel order"
                                                                    aria-label="Cancel order"
                                                                    className="p-2 rounded-md border border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Home Visit Modal */}
            {selectedVisit && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedVisit(null)}
                >
                    <div
                        className="bg-tailor-darker border border-tailor-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between px-8 py-6 border-b border-tailor-gold/20 sticky top-0 bg-tailor-darker z-10">
                            <div>
                                <h2 className="text-2xl font-serif text-white">Home Visit Details</h2>
                                <p className="text-gray-400 text-sm mt-1">Request ID: {selectedVisit._id}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedVisit(null)} aria-label="Close" className="text-gray-400 hover:text-tailor-gold transition-colors p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${visitStatusColor(selectedVisit.status)}`}>{selectedVisit.status}</span>
                                <span className="text-gray-500 text-sm">{selectedVisit.serviceType || 'Home Concierge'}</span>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Customer</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-gray-400">Name</p><p className="text-white font-medium">{selectedVisit.name}</p></div>
                                    <div><p className="text-gray-400">Email</p><p className="text-white font-medium break-all">{selectedVisit.email}</p></div>
                                    <div><p className="text-gray-400">Phone</p><p className="text-white font-medium">{selectedVisit.contact}</p></div>
                                    <div><p className="text-gray-400">Account</p><p className="text-white font-medium">{selectedVisit.user ? (selectedVisit.user.name || 'Registered') : 'Guest'}</p></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Visit Location</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="sm:col-span-2"><p className="text-gray-400">Address</p><p className="text-white font-medium">{selectedVisit.address}</p></div>
                                    <div><p className="text-gray-400">City</p><p className="text-white font-medium">{selectedVisit.city}</p></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Schedule</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-gray-400">Preferred Date</p><p className="text-white font-medium">{selectedVisit.preferredDate}</p></div>
                                    <div><p className="text-gray-400">Preferred Time</p><p className="text-white font-medium">{selectedVisit.preferredTime}</p></div>
                                    <div><p className="text-gray-400">Requested On</p><p className="text-white font-medium">{formatDate(selectedVisit.createdAt)}</p></div>
                                    <div><p className="text-gray-400">Last Updated</p><p className="text-white font-medium">{formatDate(selectedVisit.updatedAt)}</p></div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Notes</h3>
                                <p className="text-gray-300 text-sm whitespace-pre-wrap bg-tailor-black/50 border border-tailor-gold/10 rounded-md px-4 py-3">
                                    {selectedVisit.notes || <span className="text-gray-500">No notes provided.</span>}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {VISIT_STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleVisitStatusChange(selectedVisit._id, s)}
                                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-300 ${
                                                selectedVisit.status === s
                                                    ? 'bg-tailor-gold text-tailor-black border-tailor-gold'
                                                    : 'border-tailor-gold/30 text-gray-300 hover:border-tailor-gold'
                                            }`}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-4 border-t border-tailor-gold/20 flex justify-end sticky bottom-0 bg-tailor-darker">
                            <button type="button" onClick={() => setSelectedVisit(null)} className="px-6 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Suit Order Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-tailor-darker border border-tailor-gold/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between px-8 py-6 border-b border-tailor-gold/20 sticky top-0 bg-tailor-darker z-10">
                            <div>
                                <h2 className="text-2xl font-serif text-white">{selectedOrder.isExclusive ? 'Exclusive Order Details' : 'Suit Order Details'}</h2>
                                <p className="text-gray-400 text-sm mt-1">Order ID: {selectedOrder._id}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close" className="text-gray-400 hover:text-tailor-gold transition-colors p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            <div className="flex items-center flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${orderStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                                {selectedOrder.isExclusive && (
                                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${paymentStatusColor(selectedOrder.paymentStatus)}`}>
                                        Payment: {selectedOrder.paymentStatus}
                                    </span>
                                )}
                                <span className="text-gray-500 text-sm">Placed {formatDate(selectedOrder.createdAt)}</span>
                            </div>

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Customer</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-gray-400">Name</p><p className="text-white font-medium">{selectedOrder.user?.name || '—'}</p></div>
                                    <div><p className="text-gray-400">Email</p><p className="text-white font-medium break-all">{selectedOrder.user?.email || '—'}</p></div>
                                    <div><p className="text-gray-400">Phone</p><p className="text-white font-medium">{selectedOrder.user?.contact || '—'}</p></div>
                                </div>
                            </div>

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
                                            <div><p className="text-gray-400">Size</p><p className="text-white font-medium">{selectedOrder.size || 'N/A'}</p></div>
                                            <div><p className="text-gray-400">Amount</p><p className="text-tailor-gold font-bold">Rs. {Number(selectedOrder.amount).toLocaleString('en-IN')}</p></div>
                                            <div><p className="text-gray-400">Method</p><p className="text-white font-medium capitalize">{selectedOrder.paymentMethod}</p></div>
                                            {selectedOrder.transactionId && (
                                                <div className="sm:col-span-2"><p className="text-gray-400">Transaction ID</p><p className="text-white font-mono text-xs break-all">{selectedOrder.transactionId}</p></div>
                                            )}
                                            {selectedOrder.transactionUuid && (
                                                <div className="sm:col-span-2"><p className="text-gray-400">Reference UUID</p><p className="text-white font-mono text-xs break-all">{selectedOrder.transactionUuid}</p></div>
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

                            {selectedOrder.status === 'Cancelled' && (selectedOrder.cancelReason || selectedOrder.cancelledBy) && (
                                <div className={`rounded-md p-4 border ${selectedOrder.cancelledBy === 'Admin' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                                    <p className={`text-sm font-semibold mb-1 ${selectedOrder.cancelledBy === 'Admin' ? 'text-red-200' : 'text-orange-200'}`}>
                                        Cancelled by {selectedOrder.cancelledBy || 'Unknown'}
                                        {selectedOrder.cancelledAt && ` on ${new Date(selectedOrder.cancelledAt).toLocaleString()}`}
                                    </p>
                                    {selectedOrder.cancelReason && (
                                        <p className="text-gray-200 text-sm italic">"{selectedOrder.cancelReason}"</p>
                                    )}
                                    {selectedOrder.paymentStatus === 'Refunded' && (
                                        <p className="text-orange-300 text-xs mt-2">
                                            Refund of Rs. {Number(selectedOrder.amount).toLocaleString('en-IN')} processed
                                            {selectedOrder.refundedAt && ` on ${new Date(selectedOrder.refundedAt).toLocaleString()}`}.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <h3 className="text-tailor-gold text-sm uppercase tracking-wider mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ORDER_STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleOrderStatusChange(selectedOrder._id, s)}
                                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-300 ${
                                                selectedOrder.status === s
                                                    ? 'bg-tailor-gold text-tailor-black border-tailor-gold'
                                                    : 'border-tailor-gold/30 text-gray-300 hover:border-tailor-gold'
                                            }`}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-4 border-t border-tailor-gold/20 flex flex-col sm:flex-row justify-between gap-3 sticky bottom-0 bg-tailor-darker">
                            <div>
                                {selectedOrder.status !== 'Cancelled' ? (
                                    <button
                                        type="button"
                                        onClick={() => { setCancelTarget(selectedOrder); setCancelReason(''); }}
                                        className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {selectedOrder.paymentStatus === 'Completed' ? 'Cancel & Refund' : 'Cancel Order'}
                                    </button>
                                ) : (
                                    <span className="text-red-300 text-sm italic">
                                        This order has been cancelled
                                        {selectedOrder.paymentStatus === 'Refunded' && ` and refunded`}.
                                    </span>
                                )}
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {cancelTarget && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => !cancellingAdmin && setCancelTarget(null)}
                >
                    <div
                        className="bg-tailor-darker border border-red-500/40 rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-white/10">
                            <h3 className="text-xl font-serif text-white">Cancel order on customer's behalf</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {cancelTarget.isExclusive ? cancelTarget.productTitle : (cancelTarget.orderType || 'Suit Order')}
                                {' — '}
                                {cancelTarget.user?.name || cancelTarget.user?.email || 'Customer'}
                            </p>
                        </div>
                        <div className="px-6 py-5 space-y-4 text-sm">
                            {cancelTarget.paymentStatus === 'Completed' ? (
                                <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-3 text-orange-200">
                                    A refund of <strong>Rs. {Number(cancelTarget.amount).toLocaleString('en-IN')}</strong> will be initiated to the customer's
                                    {' '}{cancelTarget.paymentMethod === 'khalti' ? 'Khalti wallet' : cancelTarget.paymentMethod === 'esewa' ? 'eSewa wallet' : 'original payment method'}.
                                </div>
                            ) : (
                                <p className="text-gray-300">No payment was completed, so no refund is required.</p>
                            )}
                            <div>
                                <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">
                                    Reason <span className="text-red-400">*</span>
                                    <span className="text-gray-500 normal-case ml-1">(visible to the customer)</span>
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="e.g. Item is out of stock, custom fabric not available, etc."
                                    rows={4}
                                    className="w-full bg-tailor-black border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-600 focus:border-tailor-gold outline-none resize-none"
                                    maxLength={500}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">{cancelReason.length}/500</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setCancelTarget(null)}
                                disabled={cancellingAdmin}
                                className="px-5 py-2 border border-white/10 text-gray-300 rounded-md hover:bg-white/5 transition-all disabled:opacity-60"
                            >
                                Keep Order
                            </button>
                            <button
                                type="button"
                                onClick={submitAdminCancel}
                                disabled={cancellingAdmin || !cancelReason.trim()}
                                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all disabled:opacity-60"
                            >
                                {cancellingAdmin ? 'Cancelling…' : (cancelTarget.paymentStatus === 'Completed' ? 'Cancel & Refund' : 'Cancel Order')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
