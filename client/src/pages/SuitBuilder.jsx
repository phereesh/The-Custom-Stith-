import React, { useState, useEffect } from 'react';
import { Header } from '../components';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { BASE_URL } from '../utils/fetchData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronRight, ChevronLeft, Check, Ruler, 
    Layers, Scissors, Palette, Info, 
    User, ShoppingBag, Shirt 
} from 'lucide-react';

const steps = [
    { id: 'type', label: "Order Type", icon: <ShoppingBag size={20} /> },
    { id: 'design', label: "Suit Design", icon: <Layers size={20} /> },
    { id: 'lapel', label: "Lapel Type", icon: <Scissors size={20} /> },
    { id: 'fabric', label: "Fabric Choice", icon: <Palette size={20} /> },
    { id: 'measure', label: "Measure & Review", icon: <Ruler size={20} /> }
];

const SuitBuilder = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);

    // Selections
    const [orderType, setOrderType] = useState('Full Suit');
    const [design, setDesign] = useState('');
    const [lapel, setLapel] = useState('');
    const [fabric, setFabric] = useState('');

    // Measurements (grouped for UI)
    const [measurements, setMeasurements] = useState({
        neck: '', chest: '', shoulders: '', sleeve: '', waist: '', suit_length: '',
        inseam: '', pant_length: '', pant_waist: '', pant_hip: '', thigh: '', ankle_wide: ''
    });

    const upperBodyFields = ['neck', 'chest', 'shoulders', 'sleeve', 'waist', 'suit_length'];
    const lowerBodyFields = ['inseam', 'pant_length', 'pant_waist', 'pant_hip', 'thigh', 'ankle_wide'];

    useEffect(() => {
        if (!auth?.user) {
            toast.error("Please login to build your custom suit");
            navigate('/login');
        } else if (auth?.user?.measurements) {
            setMeasurements({
                neck: auth.user.measurements.neck || '',
                chest: auth.user.measurements.chest || '',
                shoulders: auth.user.measurements.shoulders || '',
                sleeve: auth.user.measurements.sleeve || '',
                waist: auth.user.measurements.waist || '',
                suit_length: auth.user.measurements.suit_length || '',
                inseam: auth.user.measurements.inseam || '',
                pant_length: auth.user.measurements.pant_length || '',
                pant_waist: auth.user.measurements.pant_waist || '',
                pant_hip: auth.user.measurements.pant_hip || '',
                thigh: auth.user.measurements.thigh || '',
                ankle_wide: auth.user.measurements.ankle_wide || ''
            });
        }
    }, [auth, navigate]);

    const handleMeasurementChange = (e) => {
        setMeasurements({ ...measurements, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (currentStep === 0) return setCurrentStep(orderType === 'Pants Only' ? 3 : 1);
        if (currentStep === 1 && !design && orderType !== 'Pants Only') return toast.error("Please select a suit design");
        if (currentStep === 2 && !lapel && orderType !== 'Pants Only') return toast.error("Please select a lapel type");
        if (currentStep === 3 && !fabric) return toast.error("Please select a fabric");
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep === 3 && orderType === 'Pants Only') return setCurrentStep(0);
        setCurrentStep(currentStep - 1);
    };
    
    const goToStep = (i) => {
        if (i < currentStep) {
            if (i === 1 || i === 2) {
                if (orderType === 'Pants Only') return; // Cannot go to coat steps for pants
            }
            setCurrentStep(i);
        } else if (i === currentStep) return;
    };

    const submitOrder = async () => {
        try {
            // Validation based on orderType
            let relevantFields = [];
            if (orderType === 'Full Suit') relevantFields = [...upperBodyFields, ...lowerBodyFields];
            else if (orderType === 'Jacket Only') relevantFields = upperBodyFields;
            else if (orderType === 'Pants Only') relevantFields = lowerBodyFields;

            const allFilled = relevantFields.every(key => measurements[key] !== '');
            if (!allFilled) {
                return toast.error("Please complete all required measurements");
            }

            const { data } = await axios.post(`${BASE_URL}/api/v1/order/create`, {
                orderType,
                suitDesign: orderType === 'Pants Only' ? 'N/A' : design,
                lapelType: orderType === 'Pants Only' ? 'N/A' : lapel,
                fabricType: fabric,
                measurements
            });

            if (data?.success) {
                toast.success("Order placed successfully! Check your dashboard.");
                navigate('/dashboard');
            } else {
                toast.error(data?.message || "Failed to place order");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error submitting order");
        }
    };

    // Design options
    const orderTypes = [
        { name: 'Full Suit', desc: 'Coat + Pants set', icon: <Shirt size={32} /> },
        { name: 'Jacket Only', desc: 'Coat / Blazer only', icon: <Layers size={32} /> },
        { name: 'Pants Only', desc: 'Trousers only', icon: <User size={32} /> }
    ];

    const designOptions = [
        { name: 'Single Breasted', desc: 'Modern and versatile', icon: '🧥' },
        { name: 'Double Breasted', desc: 'Classic authority', icon: '👔' },
        { name: 'Three-Piece', desc: 'The absolute standard', icon: '🕴️' },
        { name: 'Tuxedo', desc: 'Evening elegance', icon: '🤵' }
    ];

    const lapelOptions = [
        { name: 'Notch Lapel', desc: 'Standard business style' },
        { name: 'Peak Lapel', desc: 'Formal and powerful' },
        { name: 'Shawl Lapel', desc: 'Sleek tuxedo finish' }
    ];

    const fabricOptions = [
        { name: 'Premium Wool', desc: 'Year-round comfort', price: 'Standard', icon: '🧶' },
        { name: 'Breathable Cotton', desc: 'Perfect for summers', price: 'Classic', icon: '🌿' },
        { name: 'Pure Linen', desc: 'Relaxed premium feel', price: 'Deluxe', icon: '🧵' },
        { name: 'Heritage Tweed', desc: 'Heavy textured warmth', price: 'Vintage', icon: '🧥' }
    ];

    // Filter steps for UI display
    const visibleSteps = steps.filter((step, i) => {
        if (orderType === 'Pants Only' && (i === 1 || i === 2)) return false;
        return true;
    });

    return (
        <div className="bg-tailor-black min-h-screen text-white pb-20">
            <Header />
            
            <div className="bg-gradient-to-b from-[#111] to-tailor-black pt-16 pb-12 border-b border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif text-white mb-4"
                    >
                        Build Your <span className="text-tailor-gold">Masterpiece</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-xl mx-auto">Select what you'd like to order and customize every detail.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-12">
                {/* Visual Progress Stepper */}
                <div className="max-w-4xl mx-auto mb-16 relative overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex justify-between items-center relative z-10 min-w-[600px] md:min-w-0 px-4">
                        {steps.map((step, i) => {
                            const isSkipped = orderType === 'Pants Only' && (i === 1 || i === 2);
                            if (isSkipped) return null;

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => goToStep(i)}
                                    disabled={i > currentStep}
                                    className="flex flex-col items-center group relative cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <motion.div 
                                        animate={{ 
                                            backgroundColor: i <= currentStep ? '#d4af37' : '#1a1a1a',
                                            scale: i === currentStep ? 1.2 : 1,
                                            borderColor: i <= currentStep ? '#d4af37' : 'rgba(255,255,255,0.2)'
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-20 ${i <= currentStep ? 'text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-gray-500'}`}
                                    >
                                        {i < currentStep ? <Check size={24} /> : step.icon}
                                    </motion.div>
                                    <span className={`mt-3 text-xs md:text-sm font-semibold tracking-wider transition-colors pt-2 ${i <= currentStep ? 'text-tailor-gold' : 'text-gray-600'}`}>
                                        {step.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#111] p-8 md:p-12 rounded-2xl shadow-2xl border border-white/5 min-h-[500px] flex flex-col"
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-serif text-white mb-2">{steps[currentStep].label}</h2>
                                <p className="text-gray-400">Please provide the necessary details for your order.</p>
                            </div>

                            {/* Step 0: Order Type */}
                            {currentStep === 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                                    {orderTypes.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => setOrderType(item.name)}
                                            className={`relative flex flex-col p-8 rounded-xl border-2 text-left transition-all duration-300 group ${orderType === item.name ? 'border-tailor-gold bg-tailor-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                        >
                                            <div className={`mb-6 transition-transform group-hover:scale-110 ${orderType === item.name ? 'text-tailor-gold' : 'text-gray-400'}`}>
                                                {item.icon}
                                            </div>
                                            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-tailor-gold transition-colors">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                            {orderType === item.name && (
                                                <div className="absolute top-4 right-4 text-tailor-gold"><Check size={20} /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 1: Design Selection (Coat Only) */}
                            {currentStep === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-grow">
                                    {designOptions.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => setDesign(item.name)}
                                            className={`relative flex flex-col p-8 rounded-xl border-2 text-left transition-all duration-300 group ${design === item.name ? 'border-tailor-gold bg-tailor-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                        >
                                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-tailor-gold transition-colors">{item.name}</h3>
                                            {design === item.name && (
                                                <div className="absolute top-4 right-4 text-tailor-gold"><Check size={20} /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 2: Lapel Selection (Coat Only) */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                                    {lapelOptions.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => setLapel(item.name)}
                                            className={`relative flex flex-col p-8 rounded-xl border-2 text-left transition-all duration-300 group ${lapel === item.name ? 'border-tailor-gold bg-tailor-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                        >
                                            <h3 className="text-xl font-serif text-white mb-2 group-hover:text-tailor-gold transition-colors">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                            {lapel === item.name && (
                                                <div className="absolute top-4 right-4 text-tailor-gold"><Check size={20} /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Fabric Selection */}
                            {currentStep === 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                    {fabricOptions.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => setFabric(item.name)}
                                            className={`relative flex items-center gap-6 p-8 rounded-xl border-2 text-left transition-all duration-300 group ${fabric === item.name ? 'border-tailor-gold bg-tailor-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                        >
                                            <div className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-serif text-white mb-1 group-hover:text-tailor-gold transition-colors">{item.name}</h3>
                                                <span className="text-[10px] uppercase tracking-widest text-tailor-gold bg-tailor-gold/10 px-2 py-0.5 rounded">{item.price}</span>
                                            </div>
                                            {fabric === item.name && (
                                                <div className="absolute top-4 right-4 text-tailor-gold"><Check size={20} /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Final Measurements */}
                            {currentStep === 4 && (
                                <div className="space-y-12">
                                    {/* Visual Summary */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 p-8 rounded-xl border border-white/5 shadow-inner">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Order</span>
                                            <span className="text-lg font-serif text-tailor-gold">{orderType}</span>
                                        </div>
                                        {orderType !== 'Pants Only' && (
                                            <>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Design</span>
                                                    <span className="text-lg font-serif text-tailor-gold">{design}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Lapel</span>
                                                    <span className="text-lg font-serif text-tailor-gold">{lapel}</span>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Fabric</span>
                                            <span className="text-lg font-serif text-tailor-gold">{fabric}</span>
                                        </div>
                                    </div>

                                    {/* Categorized Measurements */}
                                    <div className="space-y-12 pb-10">
                                        {/* Upper Body Section */}
                                        {orderType !== 'Pants Only' && (
                                            <section>
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 rounded-lg bg-tailor-gold/10 flex items-center justify-center text-tailor-gold"><User size={24} /></div>
                                                    <div>
                                                        <h3 className="text-2xl font-serif text-white">Upper Body</h3>
                                                        <p className="text-gray-500 text-sm">Required for jacket/coat tailoring.</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                    {upperBodyFields.map(key => (
                                                        <div key={key} className="space-y-2">
                                                            <label className="text-gray-400 text-sm font-medium capitalize flex items-center justify-between">
                                                                {key.replace('_', ' ')} <Info size={14} className="text-gray-600" />
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name={key}
                                                                step="0.1"
                                                                value={measurements[key]}
                                                                onChange={handleMeasurementChange}
                                                                placeholder="In inches"
                                                                className="w-full bg-tailor-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-tailor-gold outline-none"
                                                                required
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {orderType === 'Full Suit' && <div className="w-full h-[1px] bg-white/5" />}

                                        {/* Lower Body Section */}
                                        {orderType !== 'Jacket Only' && (
                                            <section>
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 rounded-lg bg-tailor-gold/10 flex items-center justify-center text-tailor-gold"><Ruler size={24} /></div>
                                                    <div>
                                                        <h3 className="text-2xl font-serif text-white">Lower Body & Pants</h3>
                                                        <p className="text-gray-500 text-sm">Required for trousers tailoring.</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                    {lowerBodyFields.map(key => (
                                                        <div key={key} className="space-y-2">
                                                            <label className="text-gray-400 text-sm font-medium capitalize flex items-center justify-between">
                                                                {key.replace('_', ' ')} <Info size={14} className="text-gray-600" />
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name={key}
                                                                step="0.1"
                                                                value={measurements[key]}
                                                                onChange={handleMeasurementChange}
                                                                placeholder="In inches"
                                                                className="w-full bg-tailor-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-tailor-gold outline-none"
                                                                required
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Footer Navigation */}
                            <div className="mt-auto pt-12 flex justify-between border-t border-white/5">
                                {currentStep > 0 ? (
                                    <button onClick={prevStep} className="flex items-center gap-2 px-8 py-3 text-gray-400 hover:text-white transition-colors">
                                        <ChevronLeft size={20} /> <span>Go Back</span>
                                    </button>
                                ) : <div />}

                                {currentStep < 4 ? (
                                    <button onClick={nextStep} className="flex items-center gap-2 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-tailor-gold transition-all shadow-lg">
                                        <span>Next Detail</span> <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button onClick={submitOrder} className="flex items-center gap-3 px-12 py-4 bg-tailor-gold text-tailor-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                                        <span>Commit Order</span> <Check size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SuitBuilder;


