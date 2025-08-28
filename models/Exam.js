const mongoose=require("mongoose")
const examSchema=mongoose.Schema({
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
},
questions:[{
    question:{type:String,required:true},
    options:{type:[String],
        validate:[arr=>arr.length>=2, "At least 2 options required"]
    },
    correctAnswer:{type: Number,
        required:true,
}}],
 
passingScore:{
    type:Number,
    default:70
}
})
module.exports=mongoose.model("Exam",examSchema)