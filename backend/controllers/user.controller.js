import { User } from "../models/user.model.js";
import {Post} from '../models/post.model.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Sommethig is missing , Please cheack !",
        success: false,
      });
    }

    // cheack user is already exist or not
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({
        message: "User already exist",
        success: false,
      });
    }

    const hasedPassword = await bcrypt.hash(password, 9);

    await User.create({
      username: username,
      email: email,
      password: hasedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log("error in signup handeler");
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "email or password is missing",
      success: false,
    });
  }
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not exist",
        success: false,
      });
    }
    // Verify the password
    const cheack_password = await bcrypt.compare(password, user.password);
    if (!cheack_password) {
      return res.status(400).json({
        message: "Invalid credential",
        success: false,
      });
    }

    const populatedPosts = await Promise.all(
      user.posts.map( async (postId) => {
          const post = await Post.findById(postId);
          if(post.author.equals(user._id)){
              return post;
          }
          return null;
      })
  )

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilepic: user.profilepic,
      bio: user.bio,
      following: user.followings,
      followers: user.followers,
      posts: populatedPosts,
      bookmarks: user.bookmarks,
    };
    const token = jwt.sign({ userId: user._id }, process.env.JWt_SECRETE_KEY, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        user,
        message: `Welcome back ${user.username}`,
        success: true,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "LoggedOut sucessful",
      success: true
    });
  } catch (error) {
    console.log(error, "error in logout handeler");
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
    return res.status(200).json({
        user,
        success: true
    });
} catch (error) {
    console.log(error);
}

};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilepic = req.file;
    let cloudResponse;

    if (profilepic) {
      const fileUri = getDataUri(profilepic);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(400).json({
        message: "User is not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilepic) user.profilepic = cloudResponse.secure_url;
    
    
    await user.save();

    return res.status(200).json({
      user ,
      message: "Profile Updated",
      success: true,
      
    });
  } catch (error) {
    console.log("error in editProfile", error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getSuggestedusers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password")
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any subscriber"
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("error in geSuggestedUsrs hanel", error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const followKarneWalaId = req.id;
    const jiskoFollowKaroge = req.params.id;

    if (followKarneWalaId === jiskoFollowKaroge) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yorself",
        success: false,
      });
    }

    const user = await User.findById(followKarneWalaId);
    const targetUser = await User.findById(jiskoFollowKaroge);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "Internal Server error",
        success: false,
      });
    }

    const isFollowing = User.following.includes(jiskoFollowKaroge);

    if (isFollowing) {
      // already followed now unfollow logic written below
      await Promise.all([
        User.updateOne(
          { _id: followKarneWalaId },
          { $pull: { followings: jiskoFollowKaroge } }
        ),
        User.updateOne(
          { _id: jiskoFollowKaroge },
          { $pull: { followers: followKarneWalaId } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // folllow logic in below
      await Promise.all([
        User.updateOne(
          { _id: { followKarneWalaId } },
          { $push: { followings: jiskoFollowKaroge } }
        ),
        User.updateOne(
          { _id: { jiskoFollowKaroge } },
          { $push: { followers: followKarneWalaId } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log("error in followorunfollo endpoint", error);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
    });
  }
};
