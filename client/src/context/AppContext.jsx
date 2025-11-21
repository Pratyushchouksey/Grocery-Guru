import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [ShowUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);

  // REAL & FINAL cart state
  const [cartItems, setCartItems] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch All Products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  // Add product to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let total = 0;
    for (const id in cartItems) {
      total += cartItems[id];
    }
    return total;
  };

  // Get Cart Total Amount
  const getCartAmount = () => {
    let total = 0;

    for (const id in cartItems) {
      const itemInfo = products.find((p) => p._id === id);

      if (itemInfo) {
        total += itemInfo.offerPrice * cartItems[id];
      }
    }

    // Round to 2 decimals
    return Math.round(total * 100) / 100;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    ShowUserLogin,
    setShowUserLogin,

    products,
    currency,

    cartItems,          // 👈 FINAL BUG-FREE EXPORT
    setCartItems,

    addToCart,
    updateCartItem,
    removeFromCart,

    getCartAmount,
    getCartCount,

    searchQuery,
    setSearchQuery,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
