import React, { useState } from 'react';
import notify from '../../../Utils/notify';
import fetchData from '../../../Utils/fetchData';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
const navigate=useNavigate()
  const handleSubmit = async(e) => {
    if(!phoneNumber){
      return notify('please enter your phone number','error')
    }
    e.preventDefault();
    const res=await fetchData('auth',{
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    })
    localStorage.setItem('phoneNumber',phoneNumber)
    localStorage.setItem('newAccount',res.newAccount)
    if(res.success){
      if(res.password){
        navigate('pass')
      }else{
        notify(res.message,'success')
        navigate('otp')
      }
    }else{
      notify(res.message,'error')
    }
  };

  const handleForgotPassword = () => {
    navigate('forget-pass')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;