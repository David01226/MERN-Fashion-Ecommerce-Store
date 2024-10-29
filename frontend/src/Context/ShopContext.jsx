import React, { createContext, useEffect, useState } from 'react'

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300+1; index++) {
    cart[index] = 0
  }
  return cart;
}


const ShopContextProvider = (props) => {

  const[allProduct, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
      const fetchAllProducts = async () => {
        try {
          const res = await fetch('http://localhost:4000/allproducts');
          const data = await res.json();
          setAllProduct(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      const fetchCartItems = async () => {
        // if user logged in then fetch users cart
        if (localStorage.getItem('auth-token')) {
          try {
            const res = await fetch('http://localhost:4000/getcart', {
              method: 'POST',
              headers: {
                Accept: 'application/form-data',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
              },
              body: '', // no body needed for this request
            });
            const data = await res.json();
            setCartItems(data);
          } catch (error) {
            console.error('Error fetching cart items:', error);
          }
          // else if no user and no guest cart already set up then set one up
        } else {
          if (!localStorage.getItem('noUserCart')) {
            console.log('fetch no user cart')
            localStorage.setItem('noUserCart', JSON.stringify(cartItems));
            // but if a guest cart already in local storage then use that
          } else {
            setCartItems(JSON.parse(localStorage.getItem('noUserCart')));
          }
        }
      };

      fetchAllProducts();
      fetchCartItems();
  }, [])

  const addToCart = (itemId) => {  
    // if there is a user update the users cart
    if (localStorage.getItem('auth-token')) {
      
      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
        return updatedCart;
      });

      fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"itemId": itemId}),
      })
      .then((res) => res.json())
      .then((data) => console.log(data));
      // else update the guest cart
    } else {
      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]:prev[itemId]+1};
        
        // Update localStorage for users without an auth token
        if (!localStorage.getItem('auth-token')) {
          localStorage.setItem('noUserCart', JSON.stringify(updatedCart));
        }
    
        return updatedCart;
      });
    }
  }

  const removeFromCart = (itemId) => {
    if (localStorage.getItem('auth-token')) {

      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]: (prev[itemId] || 0) - 1 };
        return updatedCart;
      });

      fetch('http://localhost:4000/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"itemId": itemId}),
      })
      .then((res) => res.json())
      .then((data) => console.log(data));
    } else {
      setCartItems((prev) => {
        const updatedCart = { ...prev, [itemId]:prev[itemId]-1};
        
        // Update localStorage for users without an auth token
        if (!localStorage.getItem('auth-token')) {
          localStorage.setItem('noUserCart', JSON.stringify(updatedCart));
        }
    
        return updatedCart;
      });
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = allProduct.find((product) => product.id === Number(item))
        totalAmount += itemInfo.new_price * cartItems[item]
      }
    }
    return totalAmount
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item]
      }
    }
    return totalItem;
  }

  const contextValue = {allProduct, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems}

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider