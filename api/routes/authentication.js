'use strict';
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const superUser = require("../models/superUser")
  
   const userHandlers = require('../controllers/userController.js');
   const superUserHandlers = require('../controllers/superUserController.js')
 router.post('/create/superUser',superUserHandlers.addsuperUser) 
 router.post("/protected",(req,res,next)=>{
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
      res.json("go")
       
    }
  })
        
    }

}
)
  router.post("/logout",(req,res,next)=>{
  	req.session.destroy()
    res.send('logout')       
})
  router.post('/auth/login',userHandlers.sign_in)
  router.post('/auth/forgot_password',userHandlers.forgot_password)       
  router.post('/auth/reset_password',userHandlers.reset_password)
   
    
 
 module.exports = router