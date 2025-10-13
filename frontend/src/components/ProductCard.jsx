import React from 'react';

// Reusable component for displaying product information
const ProductCard = ({ product, onEdit, onDelete, onAddToCart, isAdmin = false }) => {
    if (!product) {
        return null;
    }

    const { _id, name, description, price, image } = product;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.01] flex flex-col h-full">
            <img 
                src={image} 
                alt={name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/400x300/a0aec0/white?text=No+Image"; 
                }}
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{name}</h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{description}</p>
            <div className="mt-auto pt-2 border-t border-gray-100">
                <p className="text-2xl font-extrabold text-indigo-600 mb-1">${price.toFixed(2)}</p>

                {/* --- Action Buttons --- */}
                {isAdmin ? (
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(_id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                ) : null}

                {/* Always show Add to Cart for users and guests */}
                <button
                    onClick={() => onAddToCart && onAddToCart(product)}
                    className="w-full mt-4 py-3 px-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;