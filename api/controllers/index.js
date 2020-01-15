"use strict";

var mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  cors = require("cors"),  
  school = require("../models/school"),
  company = require("../models/company"), 
  crypto = require("crypto"),
  _ = require("lodash"),
  hbs = require("nodemailer-express-handlebars"),
  email = process.env.MAILER_EMAIL_ID,
  pass = process.env.MAILER_PASSWORD,
  nodemailer = require("nodemailer");
app.use(cors());

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
//  viewEngine: {
//     extName: '.html',
//     partialsDir: './api/templates/',
//   layoutsDir: './api/templates/',
//  // defaultLayout: 'email.body.hbs',
//   },
//   viewPath: path.resolve('./api/templates/'),
//   extName: '.html'
// };

// smtpTransport.use('compile', hbs(handlebarsOptions));

exports.addSchool = function(req, res) {
  let token = crypto.randomBytes(20).toString("hex");
  let userData = {
    fullname:clean(req.body.fullname),
    email:clean(req.body.email),
    phonenumber:clean(req.body.phonenumber),
    token,
    createdAt:"'"+new Date()+"'"
  };
  school
    .findOne({
      email: clean(req.body.email)
    .then(result => {
      if (result) {
        return res.json("exist");
      } else {
        console.log("shuri school created");
        var data = {
          to: clean(req.body.email),
          from: email,
          //template: "add-school-email",
          subject: "school Account Confirmation",
          html:
            '<p>Click <a href="167.99.64.154/register?token=' +
            token +
            '">here</a> to create account</p>'
        };

        smtpTransport.sendMail(data, function(err) {
          if (!err) {
            school
              .create(userData)
              .then(result => {
                console.log("invitation sent");
                return res.json("success");
              })

              .catch(err => {
                console.log(err);
              });
          } else {
            console.log("invitation not sent because of connection error");
            return res.json("internet error");
          }
        });
      }
    })
    .catch(err => {
      res.send(err);
      console.log(err);
    });
};

exports.school = function(req, res) {
  school.find().exec(function(err, result) {
    if (err) throw err;
    if (result) {
      // console.log("shuri School users");
      return res.status(200).json(result);
    }
  });
};
exports.company = function(req, res) {
  company.find().exec(function(err, result) {
    if (err) throw err;
    if (result) {
      // console.log("shuri Company users");
      return res.status(200).json(result);
    }
  });
};

exports.addCompany = function(req, res) {
  let token = crypto.randomBytes(20).toString("hex");
  let userData = {
    fullname:clean(req.body.fullname),
    email:clean(req.body.email),
    phonenumber:clean(req.body.phonenumber),
    token,
    createdAt:"'"+new Date()+"'"
  };
  company
    .findOne({
      email: clean(req.body.email)
    })
    .then(result => {
      if (result) {
        return res.json("exist");
      } else {
        const fullname = clean(req.body.fullname);
        var data = {
          to: clean(req.body.email),
          from: email,
          // template: 'add-company-email',
          subject: "Company Account Confirmation",
          html:
            '<p>Dear '+fullname.split(" ")[0]+'Click <a href="167.99.64.154/register?token=' +
            token +
            '">here</a> to create account</p>'
        };

        smtpTransport.sendMail(data, function(err) {
          if (!err) {
            company
              .create(userData)
              .then(result => {
                console.log("invitation sent");
                return res.json("success");
              })

              .catch(err => {
                console.log(err);
              });
          } else {
            console.log(err);
            return res.json("internet error");
          }
        });
      }
    })
    .catch(err => {
      res.send(err);
      console.log(err);
    });
};
