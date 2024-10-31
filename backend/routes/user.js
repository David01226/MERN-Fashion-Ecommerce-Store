const express = require('express')
const fetchUser = require('../middleware/fetchUser');
const { 
  addToCart,
  removeFromCart,
  getUsersCart
} = require('../controllers/userController')

// instance of express router
const router = express.Router()

// routes

// ADD product to users cart
router.post('/addtocart', fetchUser, addToCart)

// REMOVE product from users cart
router.post('/removefromcart', fetchUser, removeFromCart)

// GET the users cart
router.post('/getcart', fetchUser, getUsersCart)



// export router to have access to the routes elsewhere
module.exports = router