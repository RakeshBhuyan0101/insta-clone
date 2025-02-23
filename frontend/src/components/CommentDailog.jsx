import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { setPosts } from "@/redux/features/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CommentDailog = ({ open, setOpen, post }) => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState(post.comments);
  const {posts} = useSelector(state => state.post)
  const dispatch = useDispatch()
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

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

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={post.image}
                alt="post_img"
                className="rounded-sm my-2 w-full aspect-square object-cover  rounded-l-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={post.author.profilepic} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="">
                    <Link className="font-semibold text-xs">
                      {post.author.username}
                    </Link>
                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full">
                      Add to favorites
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">

                {post.comments.map((comment) => (
                  <div className="my-2">
                    <div className="flex gap-3 items-center">
                      <Avatar>
                        <AvatarImage src={comment?.author?.profilepic} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <h1 className="font-bold text-sm">
                        {comment?.author.username}{" "}
                        <span className="font-normal pl-1">
                          {comment?.text}
                        </span>
                      </h1>
                    </div>
                  </div>
                ))}

              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                  />
                  <Button onClick={commenthandler}  disabled={!text.trim()} variant="outline">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDailog;
