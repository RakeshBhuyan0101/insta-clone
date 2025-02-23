import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/UsetGetAllMsg";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex flex-col items-center justify-center ">
        <Avatar>
          <AvatarImage src={selectedUser.profilepic} />
          <AvatarFallback>RB</AvatarFallback>
        </Avatar>
        <span>{selectedUser?.username}</span>
        <Link to={`/profile/${selectedUser?._id}`}>
          {" "}
          <Button className="h-8 my-2" variant="secondary">
            {" "}
            View Profile{" "}
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.senderId === user?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
