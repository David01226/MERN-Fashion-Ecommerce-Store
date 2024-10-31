const Users = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

// Adding product to cart data API ENDPOINT
addToCart = async (req, res) => {
  console.log('added', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
  // res.send("Added");
}

// Removing product from cart data API ENDPOINT
removeFromCart = async (req, res) => {
  console.log('removed', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  if (userData.cartData[req.body.itemId]) {
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
    // res.send("Removed");
  }
}

// Get user cartData
getUsersCart = async (req, res) => {
  console.log('Get Cart');
  let userData = await Users.findOne({_id: req.user.id})
  res.json(userData.cartData)
}

// Register a user
userSignup = async (req, res) => {
  // check if existing user
  let check = await Users.findOne({email: req.body.email})
  if (check) {
    return res.status(400).json({success: false, errors:"existing user found with same email address"})
  }
  // if user doesn't exist create the empty cart state
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i]=0;
  }
  //create the user
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  })
  //save user to mongo DB
  await user.save();
  // create token using data object
  const data = {
    user: {
      id: user.id
    }
  }
  // create token padding data and salt
  const token = jwt.sign(data, process.env.JWT_SALT);
  res.json({success: true, token})
}

// Login a user
userLogin = async (req, res) => {
  //Attempt to find the user by email from the request body
  let user = await Users.findOne({email: req.body.email});
  console.log(user)
  //If user exists, check the password matches
  if (user) {
    const passCompare = req.body.password === user.password;
    // if password matches then create a JWT for authentication and return the JWT in the response
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, process.env.JWT_SALT)
      res.json({success: true, token})
    } else {
      res.json({success: false, errors: "Wrong Password"})
    }
  } else {
    res.json({success: false, errors: "Wrong Email ID"})
  }
}


// export the functions
module.exports = {
  addToCart,
  removeFromCart,
  getUsersCart,
  userSignup,
  userLogin
}