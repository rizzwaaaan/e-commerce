// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landingpage';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/Registerpage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const guestCart = localStorage.getItem('guestCart');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else if (guestCart) {
      setCartItems(JSON.parse(guestCart));
    }
  }, []);

  useEffect(() => {
    if (user && user._id) {
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/cart/${user._id}`);
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          } else {
            console.error('Failed to fetch cart');
            setCartItems([]);
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCartItems([]);
        }
      };
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      const saveCart = async () => {
        try {
          await fetch(`http://localhost:5000/api/cart/${user._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems }),
          });
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      };
      saveCart();
    } else {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    if (guestCart.length > 0) {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userData._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestCart }),
        });
        if (response.ok) {
          localStorage.removeItem('guestCart');
          const serverCart = await response.json();
          setCartItems(serverCart);
          alert('Login successful! Your guest cart has been merged.');
        } else {
          throw new Error('Failed to merge guest cart');
        }
      } catch (error) {
        console.error('Error merging cart:', error);
        alert('Login successful, but failed to merge guest cart.');
      }
    } else {
      alert('Login successful!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCartItems([]);
    alert('Logged out successfully!');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddToCart = (product) => {
    const itemInCart = cartItems.find((item) => item._id === product._id);
    if (itemInCart) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };
  
  const handlePaymentSuccess = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar cartItemCount={cartItems.length} user={user} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<LandingPage searchTerm={searchTerm} onSearch={handleSearch} onAddToCart={handleAddToCart} userId={user?._id} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  user={user}
                />
              }
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/checkout"
              element={<CheckoutPage user={user} cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;