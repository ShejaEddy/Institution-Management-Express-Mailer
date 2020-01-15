"use strict";

var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  superUser = require("../models/superUser"),
  path = require("path"),
  async = require("async"),
  crypto = require("crypto"),
  _ = require("lodash"),
  hbs = require("nodemailer-express-handlebars"),
 email = process.env.MAILER_EMAIL_ID,
  pass = process.env.MAILER_PASSWORD,
  nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
  auth: {
    user: email,
    pass: pass
  }
});
function clean(data){    
    for (var i = data.length - 1; i >= 0; i--) {    
      data = data.replace(">","")
      data = data.replace("<","")    
      data = data.replace("'","")
      data = data.replace(":","")
      data = data.replace("=","")
      data = data.replace("(","")
      data = data.replace(")","")

    } 
    return data;
  }
// var handlebarsOptions = {
//   viewEngine: {
//     extName: ".html",
//     partialsDir: "./api/templates/"
//   },
//   viewPath: path.resolve("./api/templates/"),
//   extName: ".html"
// };

// smtpTransport.use("compile", hbs(handlebarsOptions));


exports.sign_in = function(req, res) {
 console.log(bcrypt.hashSync("shuri2020",10))
  superUser
    .findOne({
      email: clean(req.body.email)
    })
    .exec(function(err, user) {
      if (err) throw err;

      if (!user) {
        console.log("no account: in admin");
        res.json("error")
      } else {       
        var pwd = bcrypt.compareSync(clean(req.body.password), user.password);       
        if (pwd) {
         const login_token = Math.floor(Math.random()*1000000+100000000)
          const token = jwt.sign({ login_token: login_token }, "shuriDashboard", {
            expiresIn: "1h"
          });
            
           req.session.login_token=token
           req.session.user_id=user._id
           res.send("success")
           
           user.lastLogin="'"+new Date()+"'"           
           user.save()
           // res.json({ type: "superUser", auth:true, user:user ,token: token });
        } else {
          console.log("password do not match in admin");
          res.json("error")   
        }
      }
    });
};

exports.forgot_password = function(req, res) {
  async.waterfall(
    [
      function(done) {
        superUser
          .findOne({
            email: clean(req.body.email)
          })
          .exec(function(err, user) {
            if (user) {
              console.log("user found in superUser");
              done(err, user);
            } else {
              console.log("user not found in superUser");
            }
          });
      },
      function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
          var token = buffer.toString("hex");
          done(err, user, token);
        });
      },
      function(user, token, done) {
        superUser
          .findByIdAndUpdate(
            { _id: user._id },
            {
              reset_password_token: token,
              reset_password_expires: Date.now() + 86400000
            },
            { upsert: true, new: true }
          )
          .exec(function(err, new_user) {
            done(err, token, new_user);
          });
      },
      function(token, user, done) {
        var data = {
          to: user.email,
          from: email,
          template: "forgot-password-email",
          subject: "Password help has arrived!",
          html:
            '<p>Click <a href="167.99.64.154/login?reset_token=' +
            token +
            '">here</a> to reset password</p>'
        };

        smtpTransport.sendMail(data, function(err) {
          if (!err) {
             res.json("forgot sent");
          } else {
             res.json("internet error");
          }
        });
      }
    ],
    function(err) {
       res.status(422).json(err);
    }
  );
};

/**
 * Reset password
 */
exports.reset_password = function(req, res, next) {
  console.log(req.body);
  superUser
    .findOne({
      reset_password_token: clean(req.body.reset_token),
      reset_password_expires: {
        $gt: Date.now()
      }
    })
    .exec(function(err, user) {
      if (!err && user) {
        if (
          req.body.resetOpt.newPassword === clean(req.body.resetOpt.confirm_password)
        ) {
          user.password = bcrypt.hashSync(clean(req.body.resetOpt.newPassword), 10)
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.save(function(err) {
            if (err) {
               res.send('internet error');
                
            } else {
              var data = {
                to: user.email,
                from: email,
                template: "reset-password-email",
                subject: "Password Reset Confirmation",
                context: {
                  name: user.fullName
                }
              };

              smtpTransport.sendMail(data, function(err) {
                if (!err) {
                   res.json("reset sent");
                } else {
                  res.json("internet error");
                   
                }
              });
            }
          });
        } else {
           res.status(422).send({
            message: "Passwords do not match"
          });
        }
      } else {
        res.send('reset_token_expired')
        console.log('reset token expired')
      }
    });
};
