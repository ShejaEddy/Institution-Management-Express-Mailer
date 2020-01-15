const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
let bcrypt = require("bcrypt");
let _ = require("lodash");
let crypto = require("crypto");

let schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  runSettersOnQuery: true
};

// we create a user schema
let userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
      type: String
    },
    nation: {
      type: String
    },
    district: {
      type: String
    },
    sector: {
      type: String
    },
    bio: {
      type: String
    },
    gender: {
      type: String
    },
    phonenumber: {
      type: Number
    },
    company_logo: { type: String },

    reset_password_token: String,
    reset_password_expires: Number,
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Number
    },
    accept_invite_time: {
      type: Date
    },
    lastLogin: {
      type: Date
    },
    status: {
      type: Number,
      default: 0
    },
    token: {
      type: String
    },
    login_token:{
      type: String
    },
    register_token: { type: String },
    acceptInvitation: {
      type: Number,
      default: 0,
      required: false
    }
  },
  schemaOptions
);

userSchema.pre("save", function(next) {
  this.email = this.email.toLowerCase(); // ensure email are in lowercase
  // var length=(result.length)+1;
  // this._id = length
  // var currentDate = new Date().getTime();
  this.updatedAt = "'" + new Date() + "'";

  // console.log(this.password)

  console.log(this.password);

  next();
});

var shuriBusCompany = mongoose.model("shuriBusCompany", userSchema);

module.exports = shuriBusCompany;
