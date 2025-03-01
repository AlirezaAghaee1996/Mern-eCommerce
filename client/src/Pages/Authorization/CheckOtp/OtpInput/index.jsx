import React, { useRef, useState } from "react";

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill("")); // State to store OTP digits
  const inputsRef = useRef([]); // Ref to store input elements

  // Handle change in input fields
  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numeric input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus the next input field
    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Trigger onComplete callback if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex space-x-4 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputsRef.current[index] = el)}
          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
        />
      ))}
    </div>
  );
};

export default OtpInput;