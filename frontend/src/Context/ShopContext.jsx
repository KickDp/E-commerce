import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    // Fetch all products
    fetch("https://e-commerce-backend-tgse.onrender.com/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_Product(data))
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch user's cart if authenticated
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("https://e-commerce-backend-tgse.onrender.com/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .catch((error) => console.error("Error fetching cart:", error));
    }
  }, []); // Empty dependency array ensures this effect runs only once

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("https://e-commerce-backend-tgse.onrender.com/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error adding to cart:", error));
    }
  };

  const removeFromCart = (itemId) => {
    // Ensure prev[itemId] is safely decremented, defaulting to 0 if not present
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) - 1 }));
    
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("https://e-commerce-backend-tgse.onrender.com/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",  // Fixed to application/json
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Removed from cart:", data))
        .catch((error) => {
          console.error("Error removing from cart:", error);
          // Optionally handle the error, e.g., show an alert or state update
        });
    } else {
      // Handle the case when there is no auth-token (not authenticated)
      console.error("No authentication token found.");
      // Optionally show an error message to the user
    }
  };
  

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
