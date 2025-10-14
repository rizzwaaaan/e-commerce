// src/pages/Landingpage.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import LaserFlow from "../assets/LaserFlow";
import revealImg from "../assets/images/reveal.webp";

// NOTE: The fetchProducts function would ideally be updated to handle a 'suggestions' endpoint
const fetchProducts = async (searchTerm = "") => {
  try {
    const response = await fetch("https://e-commerce-b95l.onrender.com/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();

    if (searchTerm) {
      return products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// New function to simulate fetching suggestions
const fetchSuggestions = async (currentTerm) => {
  // *** NOTE: This is where you would call a dedicated backend endpoint. ***
  // e.g., const response = await fetch(`https://e-commerce-b95l.onrender.com/api/suggestions?q=${currentTerm}`);
  // For now, we will use a simple, client-side simulation based on product names.

  if (!currentTerm) return [];
  
  // Simulation: Get unique names from the products array that match the term
  const allProducts = await fetchProducts(); 
  const uniqueNames = [...new Set(allProducts.map(p => p.name))];
  
  return uniqueNames
    .filter(name => name.toLowerCase().includes(currentTerm.toLowerCase()))
    .slice(0, 5); // Limit to 5 suggestions
};


function getAuthRole() {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user.role || null;
  } catch {
    return null;
  }
}
const LandingPage = ({ searchTerm, onAddToCart, onSearch }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(getAuthRole());
  
  // NEW STATE for search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm || "");


  // Header-specific state and refs
  const revealRef = useRef(null);
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealRef.current;
    if (el) {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealRef.current;
    if (el) {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    }
  };
  // End of Header-specific code

  // Effect to load all products initially
  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setIsLoading(false);
    };
    getProducts();
    setUserRole(getAuthRole());
  }, []);

  // Effect to handle filtering based on search/sidebar filters
  useEffect(() => {
    let newFiltered = [...products];

    // Use currentSearchTerm for immediate filtering in addition to the prop searchTerm
    const activeSearch = currentSearchTerm || searchTerm;
    
    if (activeSearch && typeof activeSearch === "string") {
      newFiltered = newFiltered.filter(
        (p) => p.name && p.name.toLowerCase().includes(activeSearch.toLowerCase())
      );
    }

    if (filters.category && filters.category.length > 0) {
      newFiltered = newFiltered.filter((p) =>
        filters.category.includes(p.category)
      );
    }

    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number);
      if (max) {
        newFiltered = newFiltered.filter(
          (p) => p.price >= min && p.price <= max
        );
      } else {
        newFiltered = newFiltered.filter((p) => p.price >= min);
      }
    }

    if (filters.rating) {
      newFiltered = newFiltered.filter((p) => p.rating >= filters.rating);
    }

    setFilteredProducts(newFiltered);
  }, [searchTerm, products, filters, currentSearchTerm]);
  
  // NEW EFFECT for fetching and setting suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (currentSearchTerm.length > 1) {
        const productSuggestions = await fetchSuggestions(currentSearchTerm);
        setSuggestions(productSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms delay (debounce)

    return () => clearTimeout(delayDebounceFn);
  }, [currentSearchTerm]);
  
  // NEW HANDLER for input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setCurrentSearchTerm(value);
    // You can call onSearch here if you want immediate filtering on key stroke, 
    // but the debounce for suggestions is still useful.
    // onSearch(value); // or rely on the effect for filtering
  };

  // NEW HANDLER for clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
      setCurrentSearchTerm(suggestion);
      setSuggestions([]); // Clear suggestions
      onSearch(suggestion); // Trigger parent component to update global search term (if used)
  };


  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (filterType === "category") {
        const categories = prevFilters.category || [];
        if (categories.includes(value)) {
          return {
            ...prevFilters,
            category: categories.filter((c) => c !== value),
          };
        } else {
          return { ...prevFilters, category: [...categories, value] };
        }
      }
      return { ...prevFilters, [filterType]: value };
    });
  };

  const isAdmin = userRole === "admin";

  return (
    <>
      <header
        className="relative h-[80vh] bg-black text-white overflow-hidden flex flex-col items-center justify-center group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 z-0">
          <LaserFlow
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            color="#FF79C6"
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Discover Your Style
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Explore our curated collection of amazing products.
          </p>
          
          {/* SEARCH BAR & SUGGESTIONS CONTAINER */}
          <div className="flex justify-center mb-6 relative z-30"> 
            <input
              type="text"
              placeholder="Search for products..."
              value={currentSearchTerm}
              onChange={handleSearchInputChange} // Use the new handler
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch(currentSearchTerm) }}
              className="w-full max-w-lg px-6 py-3 rounded-full text-white bg-grat-800 outline-none ring-2 ring-purple-400"
            />
            {/* SUGGESTIONS LIST */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 w-full max-w-lg bg-white rounded-lg shadow-xl text-left border border-gray-200 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-6 py-2 text-gray-800 cursor-pointer hover:bg-gray-100 transition duration-150"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Shop Now
          </button>
        </div>
        <div
          ref={revealRef}
          className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <img
            src={revealImg}
            alt="Reveal effect"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              top: "0",
              left: "0",
              zIndex: 5,
              mixBlendMode: "lighten",
              pointerEvents: "none",
            }}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 min-h-[80vh]">
        <div className="flex flex-col md:flex-row gap-8">
          <Sidebar onFilterChange={handleFilterChange} />
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
              Featured Products
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => onAddToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-lg mt-10">
                No products found for your search and filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;