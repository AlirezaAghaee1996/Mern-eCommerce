import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

export default function Order() {

    return (
      <div className="container mx-auto px-4 py-6">

        <Outlet />
      </div>
    );
}
