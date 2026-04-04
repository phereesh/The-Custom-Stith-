import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { Input } from "../components";
import { BASE_URL } from '../utils/fetchData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  const phoneNumberPattern = /^[6-9]\d{9}$/;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z ]+$/.test(name)) {
      toast.error("Name must contain only alphabets");
      return;
    }

    if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(city)) {
      toast.error("City must contain only alphabets and spaces");
      return;
    }

    if (!phoneNumberPattern.test(contact)) {
      toast.error("Phone number must start with 9, 8, 7, or 6 and contain exactly 10 digits");
      return;
    }


    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
        name,
        password,
        email,
        city,
        contact,
      });

      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      offset: 120,
      once: true
    });
  }, []);

  return (
    <div className='bg-tailor-black min-h-screen'>
      <div className='container mx-auto px-6'>
        <form
          className='flex w-full min-h-screen justify-center items-center flex-col gap-5'
          onSubmit={onSubmit}
          data-aos="fade-up"
        >
          <div className="text-center mb-6">
            {/* <svg className="w-16 h-16 text-tailor-gold mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L11,8L10,2H8L7,8L6,2H4L6,10H8L9,4L10,10H12L13,4L14,10H16L18,2H16L15,8L14,2H12M2,12V14H22V12H2M21,16H3L4,22H20L21,16Z"/>
            </svg> */}
            <h2 className='text-4xl text-white font-serif mb-2'>Create Account</h2>
            <p className='text-gray-400'>Sign up to get started</p>
          </div>

          <div className="w-full max-w-[500px] bg-tailor-darker border border-tailor-gold/20 rounded-lg p-8 shadow-2xl">
            <Input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength="4"
              maxLength="30"
              data-aos="zoom-in"
            />

            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <Input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-aos="zoom-in"
            />

            <Input
              type="text"
              placeholder="City"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              minLength="4"
              maxLength="35"
              data-aos="zoom-in"
            />

            <Input
              type="text"
              placeholder="Phone"
              name="phone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              data-aos="zoom-in"
            />


            <button
              type='submit'
              className='w-full px-6 py-3 bg-tailor-gold text-tailor-black font-semibold rounded-md hover:bg-tailor-gold-light transition-all duration-300 shadow-lg hover:shadow-tailor-gold/50'
              data-aos="slide-up"
            >
              Sign Up
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account? {' '}
                <Link to="/login" className="text-tailor-gold hover:text-tailor-gold-light font-semibold transition-colors duration-300">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

