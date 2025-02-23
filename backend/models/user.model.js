import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  profilepic: { type: String  , default : ''},
  bio: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female"] },
  followers: [{type : mongoose.Schema.Types.ObjectId , ref :'User'}],
  followings: [{type : mongoose.Schema.Types.ObjectId , ref :'User'}],
  posts: [{type : mongoose.Schema.Types.ObjectId , ref :'Post'}],
  bookmarks: [{type : mongoose.Schema.Types.ObjectId , ref :'Post'}],
} , {timestamps: true});

export  const User = mongoose.model( "User" , userSchema )