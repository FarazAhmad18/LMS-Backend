const mongoose=require("mongoose")
const enrollSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    course:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course"
    },
    enrolled_At:{
type:Date,
default:Date.now
    },
    certificateUrl: { type: String, default: "" } 
})
module.exports=mongoose.model("Enrollment",enrollSchema)