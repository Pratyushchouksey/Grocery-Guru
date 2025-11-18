import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [isSeller, setIsSeller] = useState(false)
  const [ShowUserLogin, setShowUserLogin] = useState(false)
  const [products, setProducts] = useState([])

    const [cartItem, setCartItem] = useState({})

  // Fetch All Products
  const fetchProducts = async () => {
    setProducts(dummyProducts)
  }

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItem);

    if(cartData[itemId]){
      cartData[itemId] += 1;
    }else{
      cartData[itemId] = 1;
    }
    setCartItem(cartData);
    toast.success("Added to Cart");
  }

  //Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId] = quantity;
    setCartItem(cartData);
    toast.success("Cart Updated");
  }

  //Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    if(cartData[itemId]){
      cartData[itemId] -= 1;
      if(cartData[itemId] === 0){
        delete cartData[itemId];
      }
    }
    toast.success("Removed from Cart");
    setCartItem(cartData);
  }


  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {navigate, user, setUser, isSeller, setIsSeller , ShowUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItem};

    return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}