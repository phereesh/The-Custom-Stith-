import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/auth/forgot-password`, {
                email,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    };

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className='bg-tailor-black min-h-screen'>
            <div className='container mx-auto px-6'>
                <form
                    className='flex w-full min-h-screen justify-center items-center flex-col gap-6 py-20'
                    onSubmit={onSubmit}
                    data-aos="fade-up"
                >
                    <div className="text-center mb-6">
                        <h2 className='text-4xl text-white font-serif mb-2'>Reset Password</h2>
                        <p className='text-gray-400'>Enter your email address to receive a reset link</p>
                    </div>

                    <div className="w-full max-w-[500px] bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 shadow-2xl">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-aos="zoom-in"
                        />

                        <button
                            type='submit'
                            className='w-full px-6 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50'
                            data-aos="slide-up"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
