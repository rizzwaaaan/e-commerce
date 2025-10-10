// src/pages/PaymentPage.jsx
import React, { useState } from 'react';

const PaymentPage = ({ shippingDetails, cartItems, user, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Calculate total price from cart items
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const orderData = {
      userId: user._id,
      orderItems: cartItems,
      shippingAddress: shippingDetails,
      totalPrice: totalAmount,
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Payment successful and order placed!');
        onPaymentSuccess();
      } else {
        const errorData = await response.json();
        alert(`Payment failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Payment Details</h3>
      <form onSubmit={handlePaymentSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Choose Payment Method
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <span className="ml-2">Credit/Debit Card</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
              />
              <span className="ml-2">UPI</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Card Number</label>
              <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Card Holder Name</label>
              <input type="text" name="cardHolder" value={paymentDetails.cardHolder} onChange={handlePaymentChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700 font-bold mb-2">Expiry Date</label>
                <input type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 font-bold mb-2">CVV</label>
                <input type="text" name="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">UPI ID</label>
            <input type="text" name="upiId" value={paymentDetails.upiId} onChange={handlePaymentChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>
        )}

        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 mt-6">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;