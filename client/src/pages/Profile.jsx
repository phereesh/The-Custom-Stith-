import React, { useState, useEffect } from 'react';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../utils/fetchData';

const Profile = () => {
    const { auth, setAuth } = useAuth();

    // Measurement State
    const [neck, setNeck] = useState('');
    const [chest, setChest] = useState('');
    const [shoulders, setShoulders] = useState('');
    const [sleeve, setSleeve] = useState('');
    const [waist, setWaist] = useState('');
    const [suitLength, setSuitLength] = useState('');
    const [inseam, setInseam] = useState('');
    const [pantLength, setPantLength] = useState('');
    const [pantWaist, setPantWaist] = useState('');
    const [pantHip, setPantHip] = useState('');
    const [thigh, setThigh] = useState('');
    const [ankleWide, setAnkleWide] = useState('');

    useEffect(() => {
        if (auth?.user?.measurements) {
            setNeck(auth.user.measurements.neck || '');
            setChest(auth.user.measurements.chest || '');
            setShoulders(auth.user.measurements.shoulders || '');
            setSleeve(auth.user.measurements.sleeve || '');
            setWaist(auth.user.measurements.waist || '');
            setSuitLength(auth.user.measurements.suit_length || '');
            setInseam(auth.user.measurements.inseam || '');
            setPantLength(auth.user.measurements.pant_length || '');
            setPantWaist(auth.user.measurements.pant_waist || '');
            setPantHip(auth.user.measurements.pant_hip || '');
            setThigh(auth.user.measurements.thigh || '');
            setAnkleWide(auth.user.measurements.ankle_wide || '');
        }
    }, [auth?.user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const measurements = { 
                neck, chest, shoulders, sleeve, waist, suit_length: suitLength, inseam,
                pant_length: pantLength, pant_waist: pantWaist, pant_hip: pantHip, thigh, ankle_wide: ankleWide
            };
            const { data } = await axios.put(`${BASE_URL}/api/v1/auth/profile`, { measurements });

            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.user });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.user;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-tailor-black min-h-screen">
            <Header />
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-serif text-white mb-2 text-center">Your Profile</h1>
                <p className="text-gray-400 mb-12 text-center text-lg">Manage your custom measurements to expedite future suit orders.</p>

                <div className="max-w-4xl mx-auto bg-tailor-darker p-8 rounded-xl shadow-2xl border border-tailor-gold/20">
                    <h2 className="text-2xl font-serif text-tailor-gold mb-6 border-b border-white/10 pb-4">Personal Measurements (inches)</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Neck Size</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={neck}
                                    onChange={(e) => setNeck(e.target.value)}
                                    placeholder="e.g. 15.5"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Chest Width</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={chest}
                                    onChange={(e) => setChest(e.target.value)}
                                    placeholder="e.g. 40"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Shoulder Width</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={shoulders}
                                    onChange={(e) => setShoulders(e.target.value)}
                                    placeholder="e.g. 18"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Sleeve Length</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={sleeve}
                                    onChange={(e) => setSleeve(e.target.value)}
                                    placeholder="e.g. 34.5"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Waist</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={waist}
                                    onChange={(e) => setWaist(e.target.value)}
                                    placeholder="e.g. 32"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Suit Length</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={suitLength}
                                    onChange={(e) => setSuitLength(e.target.value)}
                                    placeholder="e.g. 30"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Inseam</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={inseam}
                                    onChange={(e) => setInseam(e.target.value)}
                                    placeholder="e.g. 30"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-6 mt-2">
                                <h3 className="text-xl font-serif text-tailor-gold">Pant Specific Measurements</h3>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Pant Length</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={pantLength}
                                    onChange={(e) => setPantLength(e.target.value)}
                                    placeholder="e.g. 40"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Pant Waist</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={pantWaist}
                                    onChange={(e) => setPantWaist(e.target.value)}
                                    placeholder="e.g. 34"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Pant Hip</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={pantHip}
                                    onChange={(e) => setPantHip(e.target.value)}
                                    placeholder="e.g. 38"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Thigh</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={thigh}
                                    onChange={(e) => setThigh(e.target.value)}
                                    placeholder="e.g. 22"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Ankle Wide</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={ankleWide}
                                    onChange={(e) => setAnkleWide(e.target.value)}
                                    placeholder="e.g. 14"
                                    className="w-full bg-tailor-black border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:border-tailor-gold focus:ring-1 focus:ring-tailor-gold"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                            >
                                Save Measurements
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
