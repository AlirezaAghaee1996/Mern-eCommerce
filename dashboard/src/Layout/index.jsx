import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Store/Slices/AuthSlice";
import { useState } from "react";
import { 
  FiHome, 
  FiList, 
  FiPlus, 
  FiEdit, 
  FiLogOut, 
  FiChevronLeft,
  FiChevronRight,
  FiServer ,
  FiUser ,
  FiMap, 
  FiCodesandbox,
  FiCodepen,
  FiBox,FiPercent,
  FiMessageSquare,
  FiShoppingCart
} from "react-icons/fi";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Collapsible Sidebar */}
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg p-4 transition-all duration-200 flex flex-col`}>
        <div className="flex-1">
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mb-6 p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
          >
            {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
          </button>

          {/* Logo/Sidebar Header */}
          <div className={`text-2xl font-bold text-gray-800 mb-8 ${isCollapsed ? 'text-center' : 'px-2'}`}>
            {isCollapsed ? "⚡" : "Admin Panel"}
          </div>

          {/* Navigation Menu */}
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiHome className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiList className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Categories
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/brand"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiServer className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Brands
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/user"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiUser className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Users
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/address"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiMap className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Address
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/product"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiBox className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Products
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/variant"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiCodepen className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                    Variants
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/product-variant"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiCodesandbox className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                   Product Variants
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/discount-code"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiPercent className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                   Discount Code
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/comments"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiMessageSquare className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                   Comments
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiShoppingCart className="flex-shrink-0" size={20} />
                  <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
                   Orders
                  </span>
                </Link>
              </li>
              
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="flex-shrink-0" size={20} />
          <span className={`ml-3 ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100'}`}>
            Logout
          </span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {/* Header with Collapse Toggle (Mobile) */}
        <header className="bg-white shadow-sm p-4 mb-8 rounded-lg flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Welcome, Admin</h1>
        </header>

        {/* Content Container */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;