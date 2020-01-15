'use strict';

var express = require('express'),
  cors = require('cors'),
  app = express(),
  jwt = require('jsonwebtoken'),
  port = process.env.PORT || 1000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  jsonwebtoken = require("jsonwebtoken"),
  bcrypt=require("bcrypt"),
   path=require("path"),
   session=require("express-session"),
   MongoDBStore = require("connect-mongodb-session")(session);
var history = require('connect-history-api-fallback');
var cookieParser = require('cookie-parser')
const client2 =  express.static(path.join(__dirname ,'../client/dist'))
app.use(client2);
app.use(history({disableDotRule: true}));
app.use(client2);
app.get('/',function (req, res) {
res.render(path.join(__dirname , '../client/dist/index.html'))
})

mongoose.connect('mongodb://localhost:27017/mydb',
{useNewUrlParser:true})
.then(()=>console.log('db connected'))
.catch((err)=>console.log('db not connected'))

app.use(cookieParser())
app.use(session({
cookieName:"Dash" ,  
   store : store ,
   secret: "12345678",
   resave: false,
   saveUninitialized: true,
   httpOnly: true,  // dont let browser javascript access cookie ever
   // secure: true, // only use cookie over https
   ephemeral: true // delete this cookie while browser close
}))
app.use(express.static(__dirname + "/public/uploads/"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const checkAuthorization = function (req, res, next) {

    const userJWT = req.session.login_token
    if (!userJWT) {
        res.json("invalid")
    }
   
    else {
        const userJWTPayload = jwt.verify(userJWT, "Dash",function(
    err,
    decoded
  ) {
    if (err) {
      req.session.destroy()
      res.json("invalid");
    } else {     
      
      next();
    }
  })
        
    }
}

var user = require('./api/routes/authentication')
var router = require('./api/routes/system');
app.use('/api',checkAuthorization, router)
app.use('/user',user)


app.listen(port);

console.log('Dashboard is listenning on port : ' + port);

module.exports = app;
