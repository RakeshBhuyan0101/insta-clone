import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import React, { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/features/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.auth)
  const {posts} = useSelector(state => state.post)
  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false)
        setCaption("")
        setImagePreview("")
        setFile("")
      }
    } catch (error) {
        console.log(message)
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className="text-center font-semibold">
            Create new post
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={user?.profilepic} alt="img" />
              <AvatarFallback>RB</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">{user?.username}</h1>
              <h1 className="text-gray-600 text-xs">{user?.bio}</h1>
            </div>
          </div>

          <Textarea
            className="focus-visible:ring-transparent border-none  "
            placeholder="Enter a caption... "
            onChange={(e) => setCaption(e.target.value)}
          />

          {imagePreview && (
            <div>
              <img
                src={imagePreview}
                alt="image"
                className="object-cover h-full w-[40%] rounded-md"
              />
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />

          <Button
            onClick={() => imageRef.current.click()}
            className="w-fit mx-auto bg-[#0095F6] hover:bg-[#378ec9] "
          >
            Select from device
          </Button>

          {imagePreview &&
            (loading ? (
              <Button>
                <Loader2 className="animate-spin mr-2 size-4" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={createPostHandler}
                className="w-full"
              >
                {" "}
                Post{" "}
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
