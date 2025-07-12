// Importing Express
require('dotenv').config();
const express = require("express");
const app = express();
const session = require('express-session');
// MongoDB
// const mongoose = require('mongoose');

// let MONGODB_URI = `${process.env.PROTOCOL}://${encodeURIComponent(process.env.MONGODB_USER)}:${encodeURIComponent(process.env.MONGODB_PASS)}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?authSource=admin`;
// console.log(MONGODB_URI);
// const MongoDBStore = require('connect-mongodb-session')(session);
// const store = new MongoDBStore({
//     uri: MONGODB_URI,
//     collection: 'session'
// })

// npm install --save connect-flash
var flash = require('connect-flash');

// npm install cookie - parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(
    session({
        secret: 'my secret',
        resave: 'false',
        saveUninitialized: false,
    })
);


// Importing Path
const path = require('path');

// Serving the public folder as static
app.use(express.static(path.join(__dirname, 'Public')));

// Importing Multer for uploading Images
const multer = require('multer');


// Adding body parser
const bodyParse = require('body-parser');
app.use(bodyParse.urlencoded({ extended: false }));

// Serving login status to all pages
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    // console.log(res.locals.user);
    next();
})

// Using flash function to send responses to user
app.use(flash());


const fileStorage = multer.diskStorage({
    destination: function (req, res, cb) {
        return cb(null, "./uploads")
    },
    filename: function (req, res, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})




// Setting up the ejs template engine
app.set('view engine', 'ejs');
app.set('views', 'Views')

// Importing the routers
const homeRoutes = require('./Routes/home')
const authRoutes = require('./Routes/auth')
const dashboardRoutes = require('./Routes/dashboard')
// const uploadRoutes = require('./Routes/uploadImage')

app.use(homeRoutes.router);
app.use(authRoutes.router);
app.use(dashboardRoutes.router);
// app.use(uploadRoutes);

const bcryptjs = require('bcryptjs');
app.listen(3000, () => {
           console.log('Listening on port 3000');})
// mongoose.connect(MONGODB_URI, {
//     user: process.env.MONGODB_USER,
//     pass: process.env.MONGODB_PASS,
//     dbName: "poodle"
//   })
//     .then(result => {
//         console.log('Connected To Food Truck App Database Successfully')
//         app.listen(3000, () => {
//             console.log('Listening on port 3000');
//         })
//     })
