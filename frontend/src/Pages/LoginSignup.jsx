import React from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className="loginsignup">
      <div className="page-width">
        <div className="loginsignup-container">
          <h1>Sign Up</h1>
          <div className="loginsignup-fields">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Email Address" />
            <input type="password" placeholder="Password" />
          </div>
          <button>Continue</button>
          <p className="loginsignup-login">Already have an account? <span>Login here</span></p>
          <div className="loginsignup-agree">
            <input type="checkbox" name="terms" id="terms" />
            <label for="terms">By continuing, I agree to the terms of the use & privacy policy.</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup