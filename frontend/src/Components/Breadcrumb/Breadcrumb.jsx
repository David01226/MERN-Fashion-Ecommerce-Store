import React from 'react'
import './Breadcrumb.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'
import { Link } from "react-router-dom"

const Breadcrumb = (props) => {
  const {product} = props
  let route = '/';
  if (product.category==='men') {
    route = '/mens'
  } else if (product.category==='women') {
    route = '/womens'
  } else {
    route = '/kids' 
  }
  
  return (
    <div className="breadcrumb page-width">
      <Link to='/'>SHOP</Link>
      <img src={arrow_icon} alt="" />
      <Link to={route}>{product.category}</Link>
    </div>
  )
}

export default Breadcrumb