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
            default:"Shuri Tour"
            
      },
      email: {
        type: String,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please fill a valid email address"],
            default:"shejaeddy50@gmail.com"
      },
      password: {
        type: String,
        
          },
      gender: {
        type: String,
       
      },
      phonenumber:{
        type:Number
        },
        profile: {
           type:String
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
      
    }, login_token:{
      type: String
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

  this.createdAt = "'"+new Date()+"'";
  // if(this.password.length>0){
  //   console.log(this.password)
  //   this.password = bcrypt.hashSync(this.password, 10);
  // }
  
  next();
})

var shuriAdmin = mongoose.model('shuri_admin', userSchema);

module.exports = shuriAdmin;