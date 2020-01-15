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
      // unique: true,
      index: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    idNo: {
      type: String
    },
    passport: {
      type: String
    },
    nationality: {
      type: String
    },
    permi: {
      type: String
    },
    owner_id: {
      type: String
    },
    bus: {
      type: String,
      default: null
    },
    time_assigned: {
      type: Date
    },
    time_unassigned: {
      type: Date
    },
    status: {
      type: Boolean,
      default: false
    },

    gender: {
      type: String
    },
    phonenumber: {
      type: Number
    },
    image: { type: String },

    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Number
    },

    token: {
      type: String
    },
    editedAt: {
      type: Date
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

  // this.createdAt = "'"+new Date()+"'";

  next();
});

var driver = mongoose.model("driver", userSchema);

module.exports = driver;
