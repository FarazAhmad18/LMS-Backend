const multer=require("multer")
const storage=multer.diskStorage({
    // destination
    destination:(req,file,cb)=>cb(null,"uploads/thumbnails,"),
    // filename
    filename:(req,file,cb)=>
        {const ext=file.originalname.split(".").pop()
        cb(null,`${Date.now()}.${ext}`)    

}})
module.exports=multer