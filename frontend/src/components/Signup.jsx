import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpHandel = async (e) => {
    e.preventDefault();
    const formData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Instagram</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signUpHandel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="focus-visible: ring-transparent"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
              {
                loading ? (
                  <Button type="submit" className="w-full">
                  <Loader2  className="animate-spin "/>
                  Please wait
                  </Button>
                ) : (
                  <Button type='submit' className="w-full"> Sing Up </Button>
                )
              }
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <NavLink  to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
