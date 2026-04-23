import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BookHomeVisit = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        contact: auth?.user?.contact || '',
        address: '',
        city: auth?.user?.city || '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-in-out', offset: 120, once: true });
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!/^[A-Za-z ]+$/.test(form.name)) {
            toast.error('Name must contain only alphabets');
            return false;
        }
        if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(form.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (!/^[6-9]\d{9}$/.test(form.contact)) {
            toast.error('Phone must start with 9, 8, 7, or 6 and have 10 digits');
            return false;
        }
        if (form.address.trim().length < 5) {
            toast.error('Please enter a valid address');
            return false;
        }
        if (!/^[A-Za-z ]+$/.test(form.city)) {
            toast.error('City must contain only alphabets');
            return false;
        }
        if (!form.preferredDate) {
            toast.error('Please select a preferred date');
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const picked = new Date(form.preferredDate);
        if (picked < today) {
            toast.error('Preferred date cannot be in the past');
            return false;
        }
        if (!form.preferredTime) {
            toast.error('Please select a preferred time');
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setSubmitting(true);
            const res = await axios.post(`${BASE_URL}/api/v1/home-visit/create`, form);
            if (res?.data?.success) {
                toast.success('Home visit booked successfully! We will contact you soon.');
                setForm({
                    name: auth?.user?.name || '',
                    email: auth?.user?.email || '',
                    contact: auth?.user?.contact || '',
                    address: '',
                    city: auth?.user?.city || '',
                    preferredDate: '',
                    preferredTime: '',
                    notes: '',
                });
                navigate('/');
            } else {
                toast.error(res?.data?.message || 'Failed to book home visit');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass =
        'w-full px-6 py-3 mb-4 rounded-md border border-tailor-gold/30 outline-none bg-tailor-black text-white placeholder:text-gray-500 placeholder:font-normal font-medium focus:border-tailor-gold focus:ring-2 focus:ring-tailor-gold/20 transition-all duration-300';

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto" data-aos="fade-up">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                            Book Your <span className="text-tailor-gold">Home Visit</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Share your details and our expert tailor will visit you with fabric catalogs for a personalized consultation.
                        </p>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="bg-tailor-darker border border-tailor-gold/20 rounded-2xl p-8 md:p-10 shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="98XXXXXXXX"
                                    value={form.contact}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Kathmandu"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-tailor-gold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Street, locality, landmark"
                                value={form.address}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    name="preferredDate"
                                    value={form.preferredDate}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-tailor-gold mb-2">Preferred Time</label>
                                <input
                                    type="time"
                                    name="preferredTime"
                                    value={form.preferredTime}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-tailor-gold mb-2">Notes (optional)</label>
                            <textarea
                                name="notes"
                                placeholder="Any specific styling requirements or instructions..."
                                value={form.notes}
                                onChange={handleChange}
                                rows="4"
                                className={inputClass}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-4 px-6 py-4 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Booking…' : 'Confirm Home Visit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookHomeVisit;
