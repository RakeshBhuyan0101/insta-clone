import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";
import CommentDailog from "./CommentDailog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/features/postSlice";
import { Badge } from "./ui/badge";


const Post = ( {post}) => {
  const {user , userProfile} = useSelector(state => state.auth)
  const [text , setText] = useState("")
  const [open , setOpen] = useState(false)
  const [liked , setLiked] = useState(post.likes.includes(user?._id) || false )
  const {posts} = useSelector(state => state.post)
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  // issue at here
  const [bookmark , setBookmark] = useState(result[0])
  const dispatch = useDispatch()

  const commentTextHandler = (e) => {
    const text = e.target.value
    if(text.trim()) {
      setText(text)
    }
    else {
      setText("")
    }
  }

  const deletePost = async () => {
    try {

      const response = await axios.delete(`http://localhost:3000/api/v1/post/delete/${post?._id}` , {withCredentials : true})

      if (response.data.success) {
        const updatedPosts = posts.filter(postitem => postitem._id != post?._id)
        dispatch(setPosts(updatedPosts))
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const likeAndDisLikeHanler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      console.log(res.data);
      if (res.data.success) {
          const updatedLikes = liked ? postLike - 1 : postLike + 1;
          setPostLike(updatedLikes);
          setLiked(!liked);

          // apne post ko update krunga
          const updatedPostData = posts.map(p =>
              p._id === post._id ? {
                  ...p,
                  likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
              } : p
          );
          dispatch(setPosts(updatedPostData));
          toast.success(res.data.message);
      }
  } catch (error) {
      console.log(error);
  }
  }

  const commenthandler = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/v1/post/${post._id}/comment` , {text} , {
        headers : {
          "Content-Type" : 'application/json'
        },
        withCredentials : true
      })

      if (res.data.success) {
        const updatedCommentData = [...comment , res.data.comment]
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p => 
          p._id === post._id ? {...p , comments : updatedCommentData } : p
        ) 

        dispatch(setPosts(updatedPostData))
        setText("")
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/post/${post._id}/bookmark` ,{ withCredentials : true} );
      if (res.data.success) {
        toast.success(res.data.message)
        setBookmark(!bookmark)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div  className="my-8 w-full max-w-sm mx-auto max-h-full">
      <div className="flex flex-col items-center justify-between">
        <div className="flex justify-between  gap-2 items-center w-full">
          <div className="flex justify-center items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.profilepic} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
            <h1>{post.author.username}</h1>
            {
              user?._id === post.author._id && <Badge  variant="secondary">Author</Badge>
            }
            </div>

          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="hover : cursor-pointer " />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center">
              <Button
                variant="ghost"
                className="hover: cursor-pointer w-fit text-[#ED4956] bg-white hover:bg-white font-bold"
                vairant="ghost"
              >
                Unfollow
              </Button>
              <Button variant="ghost" className="cursor-pointer w-fit" > Add to favourite</Button>
              {
                user  && user?._id === post?.author._id  && <Button onClick={deletePost}  variant="ghost" className="cursor-pointer w-fit" > Delete</Button>
              }
            </DialogContent>
          </Dialog>
        </div>

        <img
          className="rounded-sm my-2 w-full aspect-square object-cover "
          src={post.image}
          alt="postimage"
        />
      </div>

      <div className="mt-3">
        <div className="flex justify-between ">
          <div className="flex gap-2 items-center">
            {
              liked ? (
                <FaHeart onClick={likeAndDisLikeHanler} size={24} className="hover:cursor-pointer hover:text-gray-600" />
              ) : (
                <FaRegHeart onClick={likeAndDisLikeHanler} size={24} className="hover:cursor-pointer hover:text-gray-600" />
              )
            }
            
            <FiMessageCircle size={24} onClick={() => setOpen(true)} className="hover:cursor-pointer hover:text-gray-600" />
            <LuSend size={24} className="hover:cursor-pointer hover:text-gray-600" />
          </div>
          {
            bookmark ? (
              <FaBookmark onClick={bookmarkHandler} size={24} className="hover:cursor-pointer hover:text-gray-600"/>
            ) : (
              <FaRegBookmark onClick={bookmarkHandler} size={24} className="hover:cursor-pointer hover:text-gray-600"/>
            )
          }
          {/* <FaRegBookmark onClick={bookmarkHandler} size={24} className="hover:cursor-pointer hover:text-gray-600"/> */}
        </div>
        <span className="font-medium block mb-2">{post.likes.length} likes </span>
        <p>
          <span className="font-medium mr-2">{post?.caption}</span>
          
        </p>
        <span onClick={() => setOpen(true)} className=" hover:cursor-pointer" > {`view all ${comment.length} comments`} </span>
        <CommentDailog open={open} setOpen= {setOpen}  post={post} />
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Add a comment ..."
            className="outline-none text-sm w-full"
            value={text}
            onChange={commentTextHandler}
            
            />

            { 
              text && <span onClick={commenthandler} className="text-[#3BADF8] cursor-pointer">post</span>
            }
        </div>
      </div>
      
    </div>
  );
};

export default Post;
