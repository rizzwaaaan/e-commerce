import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
          <span className="ml-2 text-sm text-gray-500">({product.rating.toFixed(1)})</span>
        </div>
        <button
          onClick={() => onAddToCart(product)} // This is the call that passes the product up
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;