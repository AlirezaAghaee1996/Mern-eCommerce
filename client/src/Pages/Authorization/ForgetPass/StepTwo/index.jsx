import React, { useState, useEffect } from "react";
import notify from "../../../../Utils/notify";
import { useDispatch } from "react-redux";
import { login } from "../../../../Store/Slices/AuthSlice";
import fetchData from "../../../../Utils/fetchData";

export default function ForgetPassStepTwo({ handleStep }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array to store OTP digits
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const dispatch = useDispatch();

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus to the next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return notify("Please enter a valid 6-digit OTP", "error");
    }

    if (!newPassword) {
      return notify("Please enter a new password", "error");
    }

    const res = await fetchData("auth/forget", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: localStorage.getItem("phoneNumber"),
        password: newPassword,
        code: otpCode,
      }),
    });

    if (res.success) {
      notify("Password updated successfully!", "success");
      dispatch(login({ token: res.data.token, user: res.data.user }));
    } else {
      notify(res.message, "error");
    }
  };

  // Handle resend OTP
  const handleResendCode = async () => {
    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: localStorage.getItem("phoneNumber") }),
    });

    if (res.success) {
      notify("OTP resent successfully!", "success");
      setTimer(120); // Reset timer to 2 minutes
      setIsResendDisabled(true); // Disable resend button
    } else {
      notify(res.message, "error");
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false); // Enable resend button when timer reaches 0
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format timer to MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your phone and your new password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* OTP Input */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP (6 digits)
            </label>
            <div className="mt-1 flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResendDisabled}
                className={`text-sm font-medium ${
                  isResendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-500"
                }`}
              >
                Resend Code {isResendDisabled && `(${formatTime(timer)})`}
              </button>
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Back Button */}
          <div>
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Step One
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}