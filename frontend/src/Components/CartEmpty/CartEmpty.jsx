import React from 'react'
import { Link } from "react-router-dom"
import './CartEmpty.css'

const CartEmpty = () => {
  return (
    <div className="cartempty page-width">
      <h3>Your Cart Is Empty</h3>
      <Link to='/'>Continue Shopping?</Link>
    </div>
  )
}

export default CartEmpty