import React, { useContext } from 'react'
import CartItems from "../Components/CartItems/CartItems"
import { ShopContext } from "../Context/ShopContext"
import CartEmpty from "../Components/CartEmpty/CartEmpty"

const Cart = () => {
  const {getTotalCartItems} = useContext(ShopContext)
  const totalCartItems = getTotalCartItems()

  return (
    <div>
      {totalCartItems > 0 ? 
      <CartItems />
      :
      <CartEmpty />
      }
    </div>
  )
}

export default Cart