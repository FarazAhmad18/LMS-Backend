const mongoose=require("mongoose")
const progressSchema=mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    completedLessons:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Lesson"
    }]
},
{timestamps:true}
)
module.exports=mongoose.model("Progress",progressSchema)


