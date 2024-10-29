// dotenv package attaches environment variables to the 'process' object so we can reference them
require('dotenv').config()
const port = process.env.PORT;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path") // gives access to backend directory in express app
const cors = require("cors");
const { type } = require("os");


app.use(express.json());
app.use(cors());

// API Creation
app.get("/", (req,res) => {
  res.send("Express App is Running")
})

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req,file,cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) // provides unique name to each image before uploading
  }
})

const upload = multer({storage:storage})

// Creating upload endpoint for images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
})

// ADD PRODUCT API
app.post("/addproduct", async (req, res) => {
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
})

// REMOVE PRODUCT API
app.post("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({id: req.body.id})
    console.log("Removed")
    res.json({
      success: true,
      name: req.body.name,
    })
})

// GET ALL PRODUCTS API
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products)
})


//User Schema
const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

// REGISTER USER API ENDPOINT
app.post("/signup", async (req, res) => {
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
  const token = jwt.sign(data, 'secret_ecom');
  res.json({success: true, token})
})


// LOGIN USER ENDPOINT API
app.post("/login", async (req, res) => {
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
      const token = jwt.sign(data, 'secret_ecom')
      res.json({success: true, token})
    } else {
      res.json({success: false, errors: "Wrong Password"})
    }
  } else {
    res.json({success: false, errors: "Wrong Email ID"})
  }
})


// GET NEW COLLECTION DATA API ENDPOINT
app.get('/newcollection', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched")
  res.send(newcollection)
})


// GET POPULAR IN WOMEN DATA API ENDPOINT
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({category: 'women'});
  let popular_in_women = products.slice(0,4);
  console.log("Popular In Women Fetched")
  res.send(popular_in_women)
})


// Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({errors: "Please authenticate using valid token"})
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({errors: "please authenticate using a valid token"})
    }
  }
}

// Adding product to cart data API ENDPOINT
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log('added', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
  res.send("Added");
})

// Removing product from cart data API ENDPOINT
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log('removed', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  if (userData.cartData[req.body.itemId]) {
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
    res.send("Removed");
  }
})

// Get user cartData
app.post('/getcart', fetchUser, async (req, res) => {
  console.log('Get Cart', req.body.itemId);
  let userData = await Users.findOne({_id: req.user.id})
  res.json(userData.cartData)
})


// connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // start listening for requests only once connected to DB
    app.listen(port, () => {
      console.log('connected to database & listening on port', port)
    })
  })
  .catch((error) => {
    console.log(error)
  })