const mongoose = require("mongoose")
const validator = require('validator')
const userSchema = new mongoose.Schema({
    username : {
      type : String,
      required : true,
      trim : true
    },

    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate : [validator.isEmail , "please enter correct email"]
   },

   password : {
    type : String,
    default: null
   },

   googleId : {
    type: String,
    default:null
   },

   isPremiumFan : {
    type : Boolean,
    default: false
   },

   role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

} , {timestamps:true})


module.exports = mongoose.model("User" , userSchema)