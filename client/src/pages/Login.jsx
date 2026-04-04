import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const { auth, setAuth } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/dashboard");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
            <h2 className='text-4xl text-white font-serif mb-2'>Welcome Back</h2>
            <p className='text-gray-400'>Sign in to your account</p>
          </div>

          <div className="w-full max-w-[500px] bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 shadow-2xl">
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$"
              data-aos="zoom-in"
            />

            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-aos="zoom-in"
            />

            <div className="mb-6 text-right">
              <Link to="/forgot-password" className="text-gray-400 hover:text-tailor-gold text-sm transition-colors duration-300">
                Forgot Password?
              </Link>
            </div>

            <button
              type='submit'
              className='w-full px-6 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50'
              data-aos="slide-up"
            >
              Sign In
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account? {' '}
                <Link to="/register" className="text-tailor-gold hover:text-tailor-gold-light font-semibold transition-colors duration-300">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

