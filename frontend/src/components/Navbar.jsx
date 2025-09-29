// src/components/Navbar.jsx
import React, { useState } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemCount, user, onLogout }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/">Orque Thrifts</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition duration-300">Home</Link>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300">Products</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="text-gray-600 hover:text-gray-900 transition duration-300 focus:outline-none"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {user ? (
                  <>
                    <span className="block px-4 py-2 text-sm text-gray-700">Hi, {user.username}!</span>
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition duration-300 focus:outline-none">
              <FaShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;