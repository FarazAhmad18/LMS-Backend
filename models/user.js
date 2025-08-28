const mongoose = require("mongoose")
const bcrypt=require("bcrypt")
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','instructor','admin'],
        default:'student'
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    bio: { type: String, default: "" },
avatar: { type: String, default: "" },
isVerified: { type: Boolean, default: false },
verificationToken: { type: String },
verificationTokenExpiry: { type: Date },
otp: {
  type: String
},
otpExpiry: {
  type: Date
},
notifications: [
  {
    message: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }
],
autoApproved: { type: Boolean, default: false },
});

// userSchema.pre("save",async function (next){
// if(!this.isModified("password")) return next();
// this.password =await bcrypt.hash(this.password,10)
// next()
// })
module.exports=mongoose.model("User",userSchema)
