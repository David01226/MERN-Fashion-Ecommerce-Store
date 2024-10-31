import React from 'react'
import './Breadcrumb.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrumb = (props) => {
  const {product} = props
  return (
    <div className="breadcrumb page-width">
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category}
    </div>
  )
}

export default Breadcrumb