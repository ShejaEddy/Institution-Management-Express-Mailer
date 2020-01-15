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
  runSettersOnQuery: true,
  
};

// we create a user schema
let userSchema = new Schema({

  fullname: {
    type: String,
		trim: true,
		
  },
  owner_id:{
    type: String
  },
  driver:{
    type: String,
    default:null

  },
  time_assigned:{
    type: Date
  },
  time_unassigned:{
    type: Date
  },
  status:{
    type:Boolean,
    default:false
  },
  editedAt:{
    type:Date
  },
	yellowCard: { type: String },

  plate: { type: String },
  busSeats: { type: String },
  createdAt: {
    type: Date,
    
  },
  updatedAt: {
    type: Number,
   
  },
  createdAt:{
    type:Date,
  }

 


},schemaOptions); 




userSchema.pre('save', function (next) {
  this.plate = this
    .plate
    .toUpperCase(); // ensure plate are in uppercase
		
  // var currentDate = new Date().getTime();
  this.updatedAt = "'"+new Date()+"'";
  
  
  // this.createdAt = "'"+new Date()+"'";
 
  next();
})

var bus = mongoose.model('bus', userSchema);

module.exports = bus;