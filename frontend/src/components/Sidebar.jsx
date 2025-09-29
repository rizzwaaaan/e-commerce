import React from 'react';

const Sidebar = ({ onFilterChange }) => {
  return (
    <div className="w-full md:w-64 p-6 bg-gray-50 rounded-lg shadow-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 pb-2">Filters</h3>

      <div className="mb-8">
        <h4 className="font-bold text-lg text-gray-800 mb-3">Category</h4>
        <div className="space-y-3">
          {['Electronics', 'Apparel', 'Books', 'Home Goods'].map(category => (
            <label key={category} className="flex items-center text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              <input
                type="checkbox"
                onChange={() => onFilterChange('category', category)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="ml-3 font-medium">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold text-lg text-gray-800 mb-3">Price Range</h4>
        <select
          onChange={(e) => onFilterChange('price', e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        >
          <option value="">All Prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101+">$101+</option>
        </select>
      </div>

      <div>
        <h4 className="font-bold text-lg text-gray-800 mb-3">Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors duration-200">
              <input
                type="radio"
                name="rating"
                onChange={() => onFilterChange('rating', rating)}
                className="form-radio h-5 w-5 text-indigo-600 rounded-full focus:ring-2 focus:ring-indigo-500"
              />
              <span className="ml-3 font-medium flex items-center">
                {rating} stars & up
                <span className="ml-2 text-yellow-400">{'★'.repeat(rating)}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
