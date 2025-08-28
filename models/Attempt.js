const mongoose=require("mongoose")
const attemptSchema=mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
},
exam:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Exam"
},
answers:[Number],
score:Number,
passed:Boolean
},
{timestamps:true}
)
module.exports=mongoose.model("Attempt",attemptSchema)