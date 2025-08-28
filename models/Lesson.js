const mongoose=require("mongoose")

const lessonSchema=new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    title:{
        type:String,
        required:true},
    content:String,
    videoUrl:String,
    order:{
        type:Number,
        default:1,
    }
})
module.exports=mongoose.model("Lesson",lessonSchema)