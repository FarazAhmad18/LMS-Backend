const express=require("express")
const app=express()
const cors=require("cors")
app.use(express.json())
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
require("dotenv").config()

require("./config/database").dbConnect()
const port=process.env.PORT || 4000
const authRoutes=require("./routes/auth")
const adminRoutes=require("./routes/adminRoutes")
const instructorRoutes=require('./routes/instructorRoutes')
const studentRoutes=require("./routes/studentRoutes")
const publicRoutes=require("./routes/publicRoutes")
app.use("/api",publicRoutes)
app.use("/api/auth",authRoutes)
app.use("/admin",adminRoutes)
app.use("/instructor",instructorRoutes)
app.use("/student",studentRoutes)
app.listen(port,()=>{
console.log(`Server started at port ${port}`)
})
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);
app.use("/api/support", require("./routes/supportRoute"));
app.use("/api/user", require("./routes/userRoutes"));
app.get('/',(req,res)=>{
    res.send("API is running")
})