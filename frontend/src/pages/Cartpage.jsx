import React from 'react';

const CartPage = ({ cartItems, onRemoveFromCart, onUpdateQuantity }) => {
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-10 min-h-[80vh]">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <div className="font-semibold text-lg text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => onRemoveFromCart(item._id)}
                  className="text-red-600 hover:text-red-800 transition duration-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end items-center border-t-2 pt-4">
            <div className="text-2xl font-bold text-gray-900">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;