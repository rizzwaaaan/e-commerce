import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import AdminProductForm from '../components/AdminProductForm';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products for admin:", err);
            setError("Failed to load products. Check server connection or admin privileges.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSave = async (productData, isEditMode) => {
        try {
            if (isEditMode) {
                // Update existing product
                await updateProduct(productData._id, productData);
            } else {
                // Create new product
                await createProduct(productData);
            }
            // Reload products and reset form
            setProductToEdit(null);
            loadProducts();
        } catch (error) {
            console.error('Failed to save product:', error);
            alert(`Error: Failed to save product. Check console for details. (Is the backend running and are you logged in as Admin?)`);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        try {
            await deleteProduct(productId);
            loadProducts(); // Refresh list
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Error: Failed to delete product. Check console for details.');
        }
    };

    if (isLoading) {
        return <div className="text-center p-8 text-indigo-600 font-semibold">Loading Admin Data...</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-4 border-indigo-500 pb-2">Admin Dashboard</h1>
            
            {/* CRUD Form */}
            <AdminProductForm
                productToEdit={productToEdit}
                onSave={handleSave}
                onCancel={() => setProductToEdit(null)}
            />

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}

            {/* Product List Header & Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-700">Product Inventory ({products.length})</h2>
                <button
                    onClick={() => setProductToEdit(null)} // Clear edit state to trigger create mode
                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-700 transition transform hover:scale-105"
                >
                    + Add New Product
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isAdmin={true} // Enable Edit/Delete buttons
                        onEdit={setProductToEdit} // Pass product data to form for editing
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            
            {products.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 mt-10">No products found. Start by creating one!</p>
            )}
        </div>
    );
};

export default AdminDashboard;