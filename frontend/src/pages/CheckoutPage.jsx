// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentPage from './PaymentPage';

const CheckoutPage = ({ user, cartItems, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
  });

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const ProgressUI = ({ currentStep }) => (
    <div className="flex justify-center items-center py-8">
      <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`rounded-full border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-600' : 'border-gray-400'} text-white w-8 h-8 flex items-center justify-center font-bold`}>
          1
        </div>
        <span className="ml-2 font-semibold">Shipping Details</span>
      </div>
      <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
      <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`rounded-full border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-600' : 'border-gray-400'} text-white w-8 h-8 flex items-center justify-center font-bold`}>
          2
        </div>
        <span className="ml-2 font-semibold">Payment</span>
      </div>
      <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
      <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`rounded-full border-2 ${currentStep >= 3 ? 'border-blue-600 bg-blue-600' : 'border-gray-400'} text-white w-8 h-8 flex items-center justify-center font-bold`}>
          3
        </div>
        <span className="ml-2 font-semibold">Success</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 min-h-[80vh]">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Checkout</h2>
      <ProgressUI currentStep={step} />
      
      {step === 1 && (
        <form onSubmit={handleDetailsSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Shipping Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <input type="text" name="address" value={shippingDetails.address} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">City</label>
            <input type="text" name="city" value={shippingDetails.city} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Postal Code</label>
            <input type="text" name="postalCode" value={shippingDetails.postalCode} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Country</label>
            <input type="text" name="country" value={shippingDetails.country} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input type="tel" name="phoneNumber" value={shippingDetails.phoneNumber} onChange={handleDetailsChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
            Proceed to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <PaymentPage
          shippingDetails={shippingDetails}
          cartItems={cartItems}
          user={user}
          onPaymentSuccess={() => {
            onPaymentSuccess();
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h3>
          <p className="text-gray-700">Your order has been placed and will be shipped soon.</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;