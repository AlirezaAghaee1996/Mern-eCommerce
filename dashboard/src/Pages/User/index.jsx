import React from "react";
import { Outlet } from "react-router-dom";

const Users = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>
      {/* Outlet renders the nested route components, such as GetAllUser or UpdateUser */}
      <Outlet />
    </div>
  );
};

export default Users;
