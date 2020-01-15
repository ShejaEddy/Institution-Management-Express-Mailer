'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
 
  superUser = require('../models/superUser'),
  path = require('path'),
  bcrypt=require('bcrypt'),
  async = require('async'),
  crypto = require('crypto'),
  _ = require('lodash'),
  hbs = require('nodemailer-express-handlebars'),
 email = process.env.MAILER_EMAIL_ID,
  pass = process.env.MAILER_PASSWORD,
  nodemailer = require('nodemailer');

  var smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
      user: email,
      pass: pass
    }
  });
  
  
  // var handlebarsOptions = {
  //  viewEngine: {
  //     extName: '.html',
  //     partialsDir: './api/templates/',
  //  // layoutsDir: './api/templates/',
  //  // defaultLayout: 'email.body.hbs',
  //   },
  //   viewPath: path.resolve('./api/templates/'),
  //   extName: '.html'
  // };
  
  // smtpTransport.use('compile', hbs(handlebarsOptions));
   
  
  exports.addsuperUser = function(req,res){
    let {fullname, email} = req.body
    let userData = {
        fullname,
        email,        
        password:bcrypt.hashSync(req.body.password,10)
        
    };
    superUser.findOne({
        email : req.body.email
    })
    .then(result=>{
          if(result){
             res.json('exist')
          }else{
           
            superUser.create(userData)
            .then(result=>{              
              
                  const fullname = req.body.fullname
                 
                  
                  var data = {
                    to: req.body.email,
                    from: email,
                    template: 'add-superUser-email',
                    subject: 'SuperUser Account Confirmation',
                    context: {                      
                      url: '167.99.64.154/login',
                      email: req.body.email,
                      password: req.body.password
                    }
                  };
      
                  smtpTransport.sendMail(data, function(err) {
                    if (!err) {
                     
                      console.log('invitation sent')
                       res.json('success')
                    } else {

                      console.log('invitation not sent because of connection error')
                       res.json('failed')
                    }
                  });
                })
                
             
            .catch(err=>{
              console.log(err)
               
              
            })
          }
    })
    .catch(err=>{
       res.send(err)
      console.log(err)
    })
  }


  