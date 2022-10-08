import { userModel } from "../DB/models/user.model.js"
import jwt from 'jsonwebtoken'



export const auth=()=>{
return async(req,res,next)=>{
    try {
        const {authentcation}=req.headers
        
        const decoded=jwt.verify(authentcation,'access token')

        if(decoded&&decoded.id){
            const user=await userModel.findById(decoded.id).select('email firstName')
            if(user){
                req.user=user
                req.decoded=decoded
                next()
                
                
            }else{
                res.json({message:"not register user"})
            }
        
        }else{
            res.json({message:"invalid payload token"})
        }
    } catch (error) {
        if(error.message=="jwt expired"){
          
            res.json({ message: "catch error", error })
        }
       
    }
 
}
}