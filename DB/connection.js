import mongoose from 'mongoose';



const connectDB  = async ()=>{
    return  await mongoose.connect('mongodb://localhost:27017/saraha')
    .then(result=>{
        console.log(`ConnectedDB`);
        // console.log(result);
    }).catch(err=>console.log(`Fail to connect ${err}`))
}

export default connectDB