import React from 'react';

const Input = ({type, name, placeholder, value, onChange, pattern, minLength, maxLength}) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      name={name} 
      value={value} 
      onChange={onChange}  
      pattern={pattern} 
      minLength={minLength} 
      maxLength={maxLength} 
      required 
      className='w-full px-6 py-3 mb-4 rounded-md border border-tailor-gold/30 outline-none bg-tailor-black text-white placeholder:text-gray-500 placeholder:font-normal font-medium focus:border-tailor-gold focus:ring-2 focus:ring-tailor-gold/20 transition-all duration-300' 
    />
  )
}

export default Input;

