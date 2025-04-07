import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={() => navigate("create")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Category
      </button>
      <Outlet />
    </div>
  );
}