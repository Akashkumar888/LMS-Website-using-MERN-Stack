

import mongoose from "mongoose";
import bcrypt from 'bcryptjs'


const userSchema=new mongoose.Schema({
//  _id by default store by mongoDB
_id:{type:String,required:true},
name:{type:String,required:true},
email:{type:String,required:true},
imageUrl:{type:String,required:true},
enrolledCourses:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Course'
  }
]
},{timestamps:true,minimize:false});



  const userModel=mongoose.models.User || mongoose.model("User",userSchema);
  export default userModel;