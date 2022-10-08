import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
       required:true},

    lastName: {
        type:String,
       required:true},
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    age: Number,
    confirmEmail: {
        type: Boolean,
        default: false
    },
    
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: Date,
    isDeleted: { 
    type: Boolean, 
    default: false 
},
RefreshTokens:[]

}, {
    timestamps: true
})
export const userModel =mongoose.model('User', userSchema)