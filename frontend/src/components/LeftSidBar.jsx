import React, { useState } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/features/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidBar = () => {
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector( (store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profilepic} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  const navigate = useNavigate();

  const logOutHandeler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));

        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sideBarhandler = (text) => {
    if (text === "Logout") {
      logOutHandeler();
    } else if (text === "Create") {
      setOpen(true);
    } else if (text === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (text === "Messages") {
      navigate("/chat");
    } else if (text === "Home") {
      navigate("/");
    }
  };
  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
    <div className='flex flex-col'>
        <div className="mt-6 mb-8">
          <img  src="https://fontmeme.com/images/instagram-new-logo.png" alt="logo" />
        </div>
        <div>
            {
                sidebarItems.map((item, index) => {
                    return (
                        <div onClick={() => sideBarhandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                            {item.icon}
                            <span>{item.text}</span>
                            {
                                item.text === "Notifications" && likeNotification.length > 0 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                {
                                                    likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                        likeNotification.map((notification) => {
                                                            return (
                                                                <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                    <Avatar>
                                                                        <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                        <AvatarFallback>CN</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    </div>

    <CreatePost open={open} setOpen={setOpen} />

</div>
  );
};

export default LeftSidBar;
