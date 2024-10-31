const Users = require('../models/userModel')
const mongoose = require('mongoose')

// Adding product to cart data API ENDPOINT
addToCart = async (req, res) => {
  console.log("FROM THE OTHER SIDE")
  console.log('added', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
  // res.send("Added");
}

// Removing product from cart data API ENDPOINT
removeFromCart = async (req, res) => {
  console.log("FROM THE OTHER SIDE")
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
  console.log("FROM THE OTHER SIDE")
  console.log('Get Cart');
  let userData = await Users.findOne({_id: req.user.id})
  res.json(userData.cartData)
}


// export the functions
module.exports = {
  addToCart,
  removeFromCart,
  getUsersCart
}