import React, { useState, useEffect } from 'react';

const AdminProductForm = ({ productToEdit, onSave, onCancel }) => {
    const [product, setProduct] = useState({
        name: '',
        // description: '', // ⚠️ MODEL DOES NOT HAVE THIS FIELD - REMOVING
        price: 0,
        category: '', // ✅ ADDED: Required by model
        rating: 0,    // ✅ ADDED: Required by model
        image: '',    // ✅ RENAMED: Must be 'image' to match model
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!productToEdit;

    useEffect(() => {
        if (isEditMode) {
            // Map the productToEdit object to the required fields
            const { name, price, category, rating, image, _id } = productToEdit;
            setProduct({ name, price, category, rating, image, _id });
        } else {
            // Reset for creation mode
            setProduct({ name: '', price: 0, category: '', rating: 0, image: '' });
        }
    }, [productToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            // Only handle 'price' as a number, others as string
            [name]: (name === 'price' || name === 'rating') ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(product, isEditMode);
        } catch (error) {
            console.error('Error saving product:', error);
            // Optionally show error message to user
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 border border-indigo-200 rounded-xl shadow-inner mb-8">
            <h2 className="text-2xl font-extrabold text-indigo-700 mb-6">
                {isEditMode ? 'Edit Product' : 'Create New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price ($)"
                        value={product.price}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* ✅ ADDED: Category Input */}
                    <input
                        type="text"
                        name="category"
                        placeholder="Category (e.g., Shirts)"
                        value={product.category}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* Rating and Image URL */}
                <div className="grid grid-cols-2 gap-4">
                    {/* ✅ ADDED: Rating Input */}
                    <input
                        type="number"
                        name="rating"
                        placeholder="Rating (1-5)"
                        value={product.rating}
                        onChange={handleChange}
                        required
                        min="1"
                        max="5"
                        step="0.1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* ✅ RENAMED: Image Input (name="image") */}
                    <input
                        type="url"
                        name="image" // Renamed from imageUrl
                        placeholder="Image URL"
                        value={product.image}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                    >
                        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-24 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;