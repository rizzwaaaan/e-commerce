// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/Landingpage";
import Footer from "./components/Footer";
import CartPage from "./pages/Cartpage";
import LoginPage from "./pages/Loginpage";
import RegisterPage from "./pages/Registerpage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import { Navigate } from 'react-router-dom';


const AdminRoute = ({ element }) => {
  // We assume the user object stored in sessionStorage holds the role information.
  const userJson = sessionStorage.getItem("user");
  let user = null;
  let isAdmin = false;

  if (userJson) {
    try {
      user = JSON.parse(userJson);
      isAdmin = user && user.role === "_admin";
    } catch (e) {
      console.error("Failed to parse user data from sessionStorage:", e);
    }
  }

  return isAdmin ? element : <Navigate to="/" replace />;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    const guestCart = sessionStorage.getItem("guestCart");
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
          const response = await fetch(
            `https://e-commerce-b95l.onrender.com/api/cart/${user._id}`
          );
          if (response.ok) {
            const data = await response.json();
            setCartItems(data);
          } else {
            console.error("Failed to fetch cart");
            setCartItems([]);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
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
          await fetch(`https://e-commerce-b95l.onrender.com/api/cart/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItems }),
          });
        } catch (error) {
          console.error("Error saving cart:", error);
        }
      };
      saveCart();
    } else {
      sessionStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const handleLogin = async (loginResponseData) => {
    // loginResponseData is the full response from the server: { user: {..role..}, token: "..." }

    // ✅ FIX 1: Destructure the nested user object and the token from the response
    const { user, token } = loginResponseData; 

    // ✅ FIX 2: Store only the flat user object in state and sessionStorage
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user)); 
    
    // Store the token (This part was correct, assuming 'token' exists on loginResponseData)
    sessionStorage.setItem("authToken", token); 

    const guestCart = JSON.parse(sessionStorage.getItem("guestCart")) || [];
    if (guestCart.length > 0) {
      try {
        const response = await fetch(
          // ✅ FIX 3: Use the destructured 'user._id'
          `https://e-commerce-b95l.onrender.com/api/cart/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Use the destructured token
            },
            body: JSON.stringify({ guestCart }),
          }
        );
        if (response.ok) {
          sessionStorage.removeItem("guestCart");
          const serverCart = await response.json();
          setCartItems(serverCart);
          console.info("Login successful! Your guest cart has been merged.");
        } else {
          throw new Error("Failed to merge guest cart");
        }
      } catch (error) {
        console.error("Error merging cart:", error);
        console.warn("Login successful, but failed to merge guest cart.");
      }
    } else {
      console.info("Login successful!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken"); // Clear token
    setCartItems([]);
    console.info("Logged out successfully!"); // Replaced alert()
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddToCart = (product) => {
    const itemInCart = cartItems.find((item) => item._id === product._id);
    if (itemInCart) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
        <Navbar
          cartItemCount={cartItems.length}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                  onAddToCart={handleAddToCart}
                  userId={user?._id}
                />
              }
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
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/checkout"
              element={
                <CheckoutPage
                  user={user}
                  cartItems={cartItems}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={<AdminRoute element={<AdminDashboard />} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
