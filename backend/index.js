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
const Users = require('./models/userModel')

// API Creation
app.get("/", (req,res) => {
  res.send("Express App is Running")
})

// import routes
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/user')
// indicate where routes are coming from when landing on url endpoint
app.use('/', productRoutes)
app.use('/', userRoutes)



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
    image_url: `${process.env.REACT_APP_API_URL}/images/${req.file.filename}`
  })
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