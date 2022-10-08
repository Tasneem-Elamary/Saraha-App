import { userModel } from "../DB/models/user.model.js"
import { myEmail } from "../services/sendEmail.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
export const updateProfile=async(req,res)=>{
    const{firstName,lastname,age,phone}=req.body
    const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{firstName,lastname,age,phone},{new:true})
    res.json({ message: "done", updatedUser })
}

export const deleteProfile=async(req,res)=>{
   
   const deletedUser=await userModel.findByIdAndDelete(req.user._id)
   res.json({ message: "done", deletedUser })
}

export const getAllUsers=async(req,res)=>{
   
   const allusers=await userModel.find({})
   res.json({ message: "done", allusers })
}

export const getShareProfile = async (req, res) => {
   const user = await userModel.findById(req.params.id).select('firstName lastName age isOnline ')
   res.json({ message: "User module", user })
}

export const softDeleteProfile=async(req,res)=>{
   const user=await userModel.findById(req.user._id)
   if(user.isDeleted==false){
      const deletedUser=await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true},{new:true})
      
      res.json({ message: "done", deletedUser })
   }else{
      res.json({ message: "user is already soft deleted" })
   }
  
}



export const sendEmailforgetPassword=async(req,res)=>{
   const{email}=req.body
    const user=await userModel.findById(req.user._id)
    if(!(user.email==email)){
      res.json({message:"email doesnot exist"})
      
  }
  else{
   const token=jwt.sign({id:user._id},'passwordToken')
   const link=`${req.protocol}://${req.headers.host}/api/v1/user/resetpassword/${token}`
   const message=`<a href=${link}>follow link to reset password</a>`
   myEmail(email, message)
   res.json({message:"done",token})
}}

export const resetPassword=async(req,res)=>{
   const {token}=req.params
   const{password,cpassword}=req.body
   if(!(password===cpassword)){
      res.json({message:"password and cpassword doenot match"})
   }else{
      const decoded=jwt.verify(token,'passwordToken')
    if(decoded&&decoded.id){
      const hashpassword=await bcrypt.hash(password, 8)
      const user = await userModel.updateOne({ _id: decoded.id },
         { password: hashpassword }, { new: true })
   
         res.json({message:"Password successfully reset",user})
      }else{
         res.json({message:"invalid token"})
      }
   }
    }

    export const  lastseen =async(req,res)=>{
      const user=await userModel.findById(req.params.id).select("-_id lastSeen")
      res.json({message:"done",user})
  }