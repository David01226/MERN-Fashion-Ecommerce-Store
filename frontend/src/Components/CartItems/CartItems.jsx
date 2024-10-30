import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from "../../Context/ShopContext"
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
  const {allProduct, cartItems, removeFromCart, getTotalCartAmount} = useContext(ShopContext)

  if (!allProduct || allProduct.length === 0 || !cartItems) {
    return <div>Loading...</div>;
  }

  return (
      <div className="cartitems page-width">
      <h1 className="cartitems-title">Cart</h1>
      <div className="cartitems-format-main cartitems-labels">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {allProduct.map((e, i) => {
        if(cartItems[e.id] > 0) 
        {
          return  <div key={i}>
                    <div className="cartitems-format cartitems-format-main">
                      <img className="carticon-product-icon"  src={e.image} alt="" />
                      <p>{e.name}</p>
                      <p>${e.new_price}</p>
                      <button className="cartitems-quantity">{cartItems[e.id]}</button>
                      <p>${e.new_price*cartItems[e.id]}</p>
                      <img src={remove_icon} className="cartItems-remove-icon" onClick={()=>{removeFromCart(e.id)}} alt="" />
                    </div>
                    <hr />
                  </div>
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h2>Cart Totals</h2>
          <div className="cartitems-total-grid">
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button className="btn">PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems