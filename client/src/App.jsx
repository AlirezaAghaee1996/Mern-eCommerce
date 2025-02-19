import React from "react";
import { Toaster } from "react-hot-toast";
import { Auth, Authorization,CheckOtp,CheckPass,ForgetPass } from "./Pages";
import { Route, Routes } from "react-router-dom";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/authorization" element={<Authorization/>}>
          <Route path="/" element={<Auth/>}/>
          <Route path="/otp" element={<CheckOtp/>}/>
          <Route path="/pass" element={<CheckPass/>}/>
          <Route path="/forget-pass" element={<ForgetPass/>}/>
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}
