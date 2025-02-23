import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Messages from "./Messages";
import { MessageCircleCode } from "lucide-react";
import { setSelectedUser } from "@/redux/features/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { setMessages } from "@/redux/features/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector((state) => state.auth);
  const { onlineUsers , messages } = useSelector((state) => state.chat);
  const [textMessage, setTextMessage] = useState("");
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res)
      if (res.data.success) {
        dispatch(setMessages([...messages , res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect ( () => {
    return () => {
      dispatch(setSelectedUser(null))
    }
  },[])
  return (
    <div className="flex ml-[20%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username} </h1>
        <hr className="mb-4 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((user) => {
            const isOnline = onlineUsers.includes(user?._id);
            return (
              <div
                onClick={() => dispatch(setSelectedUser(user))}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex gap-3 items-center p-3 hover:bg-gray-500 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user?.profilepic} />
                    <AvatarFallback>RB</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium"> {user?.username}</span>
                    <span
                      className={`text-xs ${
                        isOnline ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser.profilepic} />
              <AvatarFallback> CN </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser.username} </span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
