import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold mb-4">About Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Our Story</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Sitemap</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white transition duration-300"><FaFacebook /></a>
            <a href="#" className="hover:text-white transition duration-300"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition duration-300"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition duration-300"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Orque Thrifts. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;