// src/components/Navbar.jsx
import React, { useState } from 'react';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import TextPressure from "../assets/TextPressure";

const Navbar = ({ cartItemCount, user, onLogout }) => {
  // State for the mobile hamburger menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation links
  const navLinks = (
    <>
      <Link to="/" className="text-gray-600 hover:text-gray-900 transition duration-300 block md:inline-block py-2 md:py-0">Home</Link>
      {/* These should ideally use Link components if they point to pages in your app */}
      <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 block md:inline-block py-2 md:py-0">Products</a>
      <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 block md:inline-block py-2 md:py-0">About</a>
      <a href="#" className="text-gray-600 hover:text-gray-900 transition duration-300 block md:inline-block py-2 md:py-0">Contact</a>
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div style={{ position: "relative", height: "80px" }} className="flex items-center">
      <Link to="/" className="no-underline">
        <TextPressure
          text="Orque Thrifts"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#000000ff" // Tailwind gray-800
          strokeColor="#ff0000"
          minFontSize={32}
        />
      </Link>
    </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks}
        </div>

        {/* Icons (Cart and Profile) & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          
          {/* Profile Dropdown (Hover-based - FIXED) */}
          {/* FIX: Add 'pt-2 pb-5' to the group container. 
             This creates a vertical gap that is still part of the 'group' 
             and prevents the dropdown from closing as the mouse moves down. 
          */}
          <div className="relative group pt-2 pb-5"> 
            
            {/* Icon Button */}
            <button
              className="text-gray-600 hover:text-gray-900 transition duration-300 focus:outline-none p-1 mt-3"

              aria-label="User account menu"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
            
            {/* Dropdown Content - Use a slightly smaller mt-1 to reduce the visual gap */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
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
          </div>
          
          {/* Shopping Cart Icon (No change) */}
          <div className="relative">
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition duration-300 focus:outline-none p-1">
              <FaShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger/Close) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-1"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Content (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-3 space-y-2 border-t border-gray-100 shadow-md">
          {navLinks}
          {/* Optionally, you might want to add login/register links here for mobile if they aren't obvious */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;