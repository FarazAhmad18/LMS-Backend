const jwt=require("jsonwebtoken")
exports.auth=(req,res,next)=>{
try {const token =req.header("Authorization")?.replace("Bearer ","")
if(!token)return res.status(401).json({
    success:false,
    message:"token missing"
})
const decoded=jwt.verify(token,process.env.JWT_SECRET)
req.user=decoded
next()
}
catch(err)
{
    res.status(401).json({
        success:false,
        message:"unauthorized",
        error:err
    })
}}