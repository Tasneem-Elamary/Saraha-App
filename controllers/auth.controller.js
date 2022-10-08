import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
let RefreshToken=[]
import { userModel } from "../DB/models/user.model.js"
import { myEmail } from '../services/sendEmail.js'

export const signup=async(req,res)=>{
    try {
    const{firstName,lastName,email,password,age,phone}=req.body
    const user=await userModel.findOne({email})
    if(user){
        res.json({message:"email already exist"})
    }
    else{
        const hashpassword=await bcrypt.hash(password, 8)
        const newUser = new userModel({ email, password: hashpassword, firstName,lastName })
        const savedUser = await newUser.save()
        const token=jwt.sign({id:savedUser._id},'emailToken')
        const link=`${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
        const message=`<a href=${link}>follow link to activate</a>`
        myEmail(savedUser.email, message)
        res.json({message:"done",savedUser})
    }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
    
}


export const confirmEmail=async(req,res)=>{
    try {
    const {token}=req.params
    const decoded=jwt.verify(token,'emailToken')
    if(decoded&&decoded.id){
        const user=await userModel.findById(decoded.id)
        if(user){
            if(user.confirmEmail==false){
                const confirmUser=await userModel.updateOne({_id:user._id},{confirmEmail:true},{new:true})
                res.json({message:"please logIn"})
            }else{res.json({message:"email already confirmed!!"})}
            
        }else{res.json({message:"invalid account"})}
    }else{
        res.json({message:"invalid token email"})
    }
        
    } catch (error) {
        res.json({ message: "catch error", error })
    }
    
}

export const signIn=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(user.isDeleted){
            res.json({message:"invalid  account"})
        }else{
            if(user.confirmEmail==true){
                const match = await bcrypt.compare(password, user.password)
                if(!match){
                    res.json({message:" password is incorrect"})
                }else{
                    const acesstoken=jwt.sign({id:user._id,isLoggedIn: true },'access token', { expiresIn:"5m" })
                    const refeshtoken=jwt.sign({id:user._id,isLoggedIn: true },'refresh token', { expiresIn:"1h" })
                    const updateduser=await userModel.updateOne({email},{ $push: { RefreshTokens: refeshtoken } },{new:true})
                    res.json({message:" done",acesstoken,refeshtoken})
                }
            }else{
                res.json({message:" please confirm your email first"})
            }
       
    }
    } catch (error) {
        res.json({ message: "catch error", error })
    }
    
}


export const getAccessTokenFromRefreshtoken=async(req,res)=>{
    const {refreshtoken}=req.headers
    console.log(refreshtoken);
    const decoded=jwt.verify(refreshtoken,'refresh token')

  if(decoded&&decoded.id){
   const user=await userModel.findById(decoded.id)
    if(!user.RefreshTokens.includes(refreshtoken)){
        console.log(user.RefreshTokens);
        res.json({message:"invalid refresh token"})
    }else{
       
        const acesstoken=jwt.sign({id:user._id,isLoggedIn: true },'access token', { expiresIn:"5m" })    
        res.json({ acesstoken });   
            
    }}
}

export const signOut=async(req,res)=>{
    // const {Refreshtoken}=req.query
    // console.log(Refreshtoken);

    const user=await userModel.findByIdAndUpdate(req.user.id,{$pop: {RefreshTokens: 1 },lastSeen:Date.now()},{new:true})  //remove last refresh token 
   
        
    res.json({message:"suceefully signout",user})
}

