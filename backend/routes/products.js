const express = require('express')

const { 
  getAllProducts,
  addProduct,
  removeProduct,
  getNewCollection,
  getPopular
} = require('../controllers/productController')

// instance of express router
const router = express.Router()

// routes

// GET all products
router.get('/allproducts', getAllProducts)

// POST a new workout
router.post('/addproduct', addProduct)

// POST a new workout
router.post('/removeproduct', removeProduct)

// GET all new collection products
router.get('/newcollection', getNewCollection)

// GET all popular products
router.get('/popularinwomen', getPopular)

// export router to have access to the routes elsewhere
module.exports = router