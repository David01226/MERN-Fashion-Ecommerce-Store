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