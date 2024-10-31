const Product = require('../models/productModel')
const mongoose = require('mongoose')

// GET ALL PRODUCTS API
const getAllProducts = async (req, res) => {
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products)
}


// ADD PRODUCT TO STORE API
const addProduct = async (req, res) => {
  console.log("FROM THE OTHER SIDE")
    // generate id for product
    let products = await Product.find({})
    let id;
    if (products.length>0) {
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id+1;
    } else {
      id = 1;
    }

    // create product object using mongoose schema
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    })
    console.log(product);
    // save product in database
    await product.save();
    console.log("Saved");
    // send response back
    res.json({
      success: true,
      name: req.body.name,
    })
}

// REMOVE PRODUCT FROM STORE API
const removeProduct = async (req, res) => {
  console.log("FROM THE OTHER SIDE")
    await Product.findOneAndDelete({id: req.body.id})
    console.log("Removed")
    res.json({
      success: true,
      name: req.body.name,
    })
}

// GET NEW COLLECTION DATA API ENDPOINT
const getNewCollection = async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched")
    res.send(newcollection)
}

// GET POPULAR IN WOMEN DATA API ENDPOINT
const getPopular = async (req, res) => {
    let products = await Product.find({category: 'women'});
    let popular_in_women = products.slice(0,4);
    console.log("Popular In Women Fetched")
    res.send(popular_in_women)
}

// export the functions
module.exports = {
  getAllProducts,
  addProduct,
  removeProduct,
  getNewCollection,
  getPopular
}