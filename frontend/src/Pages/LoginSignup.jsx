import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  const [state,setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const login = async () => {
    console.log("Login", formData)
    let responseData;
    await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/formData',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json().then((data) => {responseData = data}))

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.removeItem('noUserCart');
      window.location.replace('/');
    } else {
      alert(responseData.errors)
    }
  }

  const signup = async () => {
    console.log("Signup", formData)
    let responseData;
    await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/formData',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    }).then((res) => res.json().then((data) => {responseData = data}))

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/');
    } else {
      alert(responseData.errors)
    }
  }

  return (
    <div className="loginsignup">
      <div className="page-width">
        <div className="loginsignup-container">
          <h1>{state}</h1>
          <form onSubmit={(e)=>{e.preventDefault();state==="Login"?login():signup()}}>
            <div className="loginsignup-fields">
              {state==="Sign Up"?<input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" />:<></>}
              <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
              <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
            </div>
            <button type="submit">Continue</button>
          </form>
          {state==="Sign Up"?<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
          : <p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>
          }
          {/* <div className="loginsignup-agree">
            <input type="checkbox" name="terms" id="terms" />
            <label htmlFor="terms">By continuing, I agree to the terms of the use & privacy policy.</label>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default LoginSignup