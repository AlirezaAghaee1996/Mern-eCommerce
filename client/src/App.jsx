import React from "react";
import { Toaster } from "react-hot-toast";
import {
  Auth,
  Authorization,
  CheckOtp,
  CheckPass,
  ForgetPass,
  Home,
} from "./Pages";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
export default function App() {
  const token = useSelector((state) => state.auth.token);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/authorization"
          element={token ? <Navigate to={"/"} /> : <Authorization />}
        >
          <Route index element={<Auth />} />
          <Route path="otp" element={<CheckOtp />} />
          <Route path="pass" element={<CheckPass />} />
          <Route path="forget-pass" element={<ForgetPass />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
