// Import required packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Create an Express application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var post= require('./routes/posts');
// var usersRouter = require('./routes/users');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', post);
// Load environment variables
require("dotenv").config();
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next()
//   });

// Enable CORS
  const cors = require('cors');
  app.use(cors());
  app.use(cors({
    origin: 'http://localhost:3000'
  }));
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });
  
// Set up database connection and models
const os = require("os");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var Expressjwt=require("express-jwt");
mongoose.set('strictQuery', true);
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    bio: { type: String, required: false },
    registered: { type: Date, default: Date.now },
    profilePicture: { type: String, required: false },
  });
const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  items: [{
    type: String,
    required: true
  }]
})
// Create mongoose models
const Todo = mongoose.model("Todo", todoSchema);

const Users = mongoose.model("Users", userSchema);

const mongoDB = "mongodb://localhost:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
// Set up authentication middleware using Express JWT
app.use(
  "/api/private",
  Expressjwt.expressjwt({
  secret:process.env.SECRET,
  algorithms:["HS256"],
})
)
app.use(
  "/api/todos",
  Expressjwt.expressjwt({
  secret:process.env.SECRET,
  algorithms:["HS256"],
})
)
// Generate a JSON Web Token
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
// Hash passwords using bcryptjs
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)


var hash = bcrypt.hashSync("B4c0/\/", salt);

// Generate a random GUID
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function handleError(err) {
    console.error(err);
  }
  
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get user." });
    }
  });
  // Endpoint for registering a new user
app.post("/api/user/register/", (req, res) => {
  var rusername=req.body.email;
    var ruserpassword = req.body.password;
    // var image = req.body.profilePicture
    // Check if password meets the requirements (minimum 8 characters with at least one lowercase letter, one uppercase letter, one number, and one special character)
    var ruserbio="a registrant"
  if (ruserpassword.length < 8 ||!/[a-z]/.test(ruserpassword) ||!/[A-Z]/.test(ruserpassword) ||!/[0-9]/.test(ruserpassword) ||!/[~`!@#\$%\^&\*\(\)-_\+=\{\}\[\]|\\;:"<>,\.\/\?]/.test(ruserpassword)){
     return res.status(400).json("Password is not strong enough")}
  var j=0;
  Users.findOne({email:rusername},function(err,food){
    if(!food||err){
      
      var password = bcrypt.hashSync(ruserpassword, salt);
      var id=guid();
      // Create new user in the database
      new  Users({

        email: rusername, 
          password: password,
          bio: ruserbio,
          registered: new Date(),
        //   profilePicture:image
          
      }).save(function(err){
          if (err) return handleError(err);
      });
      res.send({
          success: true,
          token: token,
        //   profilePicture:image
          
      });
    }
    else{
      return res.status(403).json("Email already in use");
    }
    
  })
})

app.post("/api/email", (req, res) => {
  const email = req.auth.email;
    res.send({
      email: email,
    })
})
  // Endpoint for user login
app.post("/api/user/login", (req, res) => {
  var name=req.body.email;
  var pass=req.body.password;
  
  Users.findOne({email:name},function(err,food){
    if(!food||err){
      
      res.status(401).send({
        "success": false,
        "msg": "Invalid credentials",
      });
    }else{
      
      item=food;
      console.log(item)
      let password1=item.password
      let correctpass= bcrypt.compareSync(pass,password1)
      if(correctpass){
        const jwtPayload = {
          name:name,
          email: name,
          id:item.id
        }
        jwt.sign(
          jwtPayload,
          process.env.SECRET,
          {
            expiresIn: "4m"
          },
          (err, token) => {
            return res.json({success: true,
                token,
                email: item.id,
                trueemail:req.body.email
            });
          });

      }else{
          return res.status(401).send({
            "success": false,
            "msg": "Invalid credentials",
          });
      }   
    }
    
  })
})
app.post("/api/private", (req, res) => {
  
  if(!req.auth.email){
    res.send("unauthorized");
  }
  var aa=req.auth.email;
    res.json({email:aa});
  
  

});
app.post("/api/todos", (req, res) => {
  var idemail = req.auth;
  let id=idemail;
  const {items} = req.body;
  console.log(idemail,items,idemail.name)
  if(!idemail){
    return res.status(401).send("unauthorized");
  }
  Todo.findOne({ user: idemail.id }, (err, user1) => {
    if(!user1||err) {
      new Todo({
        user: id.id,
        items: items
      }).save(function(err){
        if (err) throw err
    });
    res.send(user1);
    } else {
      user1.items = user1.items.concat(items);
      user1.save(function(err){
        if (err) throw err
        
    });
    res.send(user1);
  }})
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});








module.exports = app;