const user = require("../models/user")

exports.hasRole=(role)=>{
return (req,res,next)=>{
if(req.user.role!==role) 
{
    res.status(402).json({
        success:false,
        message:`Access denied. ${role} only.`
    })
}
next()
}
}