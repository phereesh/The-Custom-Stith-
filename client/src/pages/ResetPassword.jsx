import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/auth/reset-password/${token}`, {
                password,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
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
                        <h2 className='text-4xl text-white font-serif mb-2'>Create New Password</h2>
                        <p className='text-gray-400'>Enter your new password below</p>
                    </div>

                    <div className="w-full max-w-[500px] bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 shadow-2xl">
                        <Input
                            type="password"
                            placeholder="New Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-aos="zoom-in"
                        />

                        <button
                            type='submit'
                            className='w-full px-6 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50'
                            data-aos="slide-up"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
