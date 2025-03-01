import React, { useState, useEffect } from "react";
import OtpInput from "./OtpInput";
import fetchData from "../../../Utils/fetchData";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/Slices/AuthSlice";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CheckOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  // Handle OTP completion
  const handleOtpComplete = async (code) => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const newAccount = localStorage.getItem("newAccount");
    const res = await fetchData("auth/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, newAccount, phoneNumber }),
    });
    if (res.success) {
      dispatch(login({ user: res?.data?.user, token: res?.data?.token }));
      notify(res.message, "success");
      navigate("/");
    } else {
      notify(res.message, "error");
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (res.success) {
      notify(res.message, "success");
      setTimer(120); // Reset the timer to 2 minutes
      setIsResendDisabled(true); // Disable the button again
    } else {
      notify(res.message, "error");
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false); // Enable the button when timer reaches 0
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timer]);

  // Format timer into minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Enter OTP
        </h2>
        <OtpInput length={6} onComplete={handleOtpComplete} />
        <p className="mt-6 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your phone.
        </p>
        <button
          onClick={handleResendOtp}
          disabled={isResendDisabled}
          className={`mt-4 w-full text-center text-sm ${
            isResendDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:text-indigo-500"
          } focus:outline-none`}
        >
          {isResendDisabled
            ? `Resend OTP in ${formatTime(timer)}`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default CheckOtp;