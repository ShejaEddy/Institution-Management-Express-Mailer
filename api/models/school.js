const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
let bcrypt 			= require("bcrypt");
let _ 				= require("lodash");
let crypto 			= require("crypto");

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
let userSchema = new Schema({

  fullname: {
    type: String,
		trim: true,
		
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
    type: String,
	
    },
  company: {
    type: String
  },
  gender: {
    type: String,
   
  },
  phonenumber:{
    type:Number
  },
  accept_invite_time:{
    type:Date
  },
	profile: {
		name: { type: String },
		gender: { type: String },
		picture: { type: String },
		location: { type: String }
	},
  reset_password_token: String,
  reset_password_expires: Number,
  createdAt: {
    type: Date,
    
  },
  updatedAt: {
    type: Number,
   
  },
  lastLogin: {
		type: Date
  },
  status: {
  type: Number,
  default: 1
},
 token:{
   type: String
 },
 acceptInvitation:{
  type: Number,
  default: 0,
  required:false
},



},schemaOptions); 




userSchema.pre('save', function (next) {
  this.email = this
    .email
    .toLowerCase(); // ensure email are in lowercase
		// var length=(result.length)+1;
		// this._id = length
  var currentDate = new Date().getTime();
  this.updatedAt = currentDate;
  if(this.password){
     this.password = bcrypt.hashSync(this.password, 10);
  }
  

  this.createdAt = "'"+new Date()+"'";
 
  next();
})

var shuriSchool = mongoose.model('shuriSchool', userSchema);

module.exports = shuriSchool;