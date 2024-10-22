import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className="newsletter page-width">
      <div className="newsletter-wrapper">
        <h2>Get Exclusive Offers On Your Email</h2>
        <p>Subscribe to our newsletter and stay updated</p>
        <div className="newsletter-inputs">
          <input type="email" placeholder="Email" />
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  )
}

export default NewsLetter