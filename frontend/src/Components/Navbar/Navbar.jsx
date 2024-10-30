import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from "react-router-dom"
import { ShopContext } from "../../Context/ShopContext"

export const Navbar = () => {

  const [menu, setMenu] = useState("shop")
  const {getTotalCartItems} = useContext(ShopContext)
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    document.querySelector('.hamburger-menu').classList.toggle('open');
  }

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    dropdown_toggle();
  };

  return (
    <div className="navbar">
      <div className="navbar-wrapper page-width">
          <div className="nav-logo">
            <Link to='/'>
              <img src={logo} alt="" />
              <p>SHOPPER</p>
            </Link>
          </div>
        <div onClick={dropdown_toggle} className="hamburger-menu">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul ref={menuRef} className="nav-menu">
          <li onClick={()=>{handleMenuClick("shop")}}><Link to='/'>Shop</Link> {menu === "shop" ? <hr/> : <></>}</li>
          <li onClick={()=>{handleMenuClick("mens")}}><Link to='/mens'>Men</Link> {menu === "mens" ? <hr/> : <></>}</li>
          <li onClick={()=>{handleMenuClick("womens")}}><Link to='/womens'>Women</Link> {menu === "womens" ? <hr/> : <></>}</li>
          <li onClick={()=>{handleMenuClick("kids")}}><Link to='/kids'>Kids</Link> {menu === "kids" ? <hr/> : <></>}</li>
        </ul>
        <div className="nav-login-cart">
          {localStorage.getItem('auth-token')
          ?
          <button className="nav-logout" onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
          :
          <Link to='/login'>
          <div className="account-icon-wrapper">
            <svg className="account-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M5.5 21a9.5 9.5 0 0 1 13 0"></path>
            </svg>
          </div>
          </Link>
          }
          <Link to='/cart'>
            <img className="nav-cart-icon" src={cart_icon} alt="" />
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
