import React, { useEffect, useState } from "react";
// import Terms from "./TermAndCondition";
// import PrivacyPolicy from "./PrivacyPolicy";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FaFingerprint,
  FaRegEye,
  FaRegEyeSlash,
  FaGoogle,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { toast, Toaster } from "sonner";
import { login, sendMagicLink } from "../services/operations/authAPI";

export function LoginSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSocialLogin = () => {
    toast("Coming soon to ease your experience");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    } else if (!(password && (password.length > 6))) {
      toast.error("Please enter a password greater than");
      return;
    } else {
      login(email, password, navigate)();
    }

    // Proceed with login
    toast.success("Logging in...");
    };


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignin = (e) => {
    e.preventDefault(); // Stop form from submitting

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Email Validation
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    } else {
      dispatch(sendMagicLink(email, navigate));
      toast.success("Signing up...");
    }
  };

  
  return (
    <div className="flex items-center justify-center">
      <Tabs defaultValue="signup" className="max-w-[400px]">
        <Toaster />
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
           <form onSubmit={handleLogin}>
            <Card className="max-w-lg mx-auto p-6 bg-white rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-center font-bold text-2xl">
                  {" "}
                  Welcome back, legend! Let’s pick up right where you left off.
                </CardTitle>
                <CardDescription>
                  <p className="mt-2 text-xs md:text-sm text-gray-400 text-center">
                    Don't have an account?{" "}
                    <span className="text-black underline cursor-pointer">
                      <a href="#">Sign up</a>
                    </span>
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Email field */}
                <div className="space-y-1 relative">
                  <MdAlternateEmail className="absolute text-gray-400 text-lg  left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="email"
                    value={email}
                    placeholder="Enter Email"
                    required
                    className="pl-10"
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>

                {/* Password field */}
                <div className="space-y-1 relative">
                  <FaFingerprint className="absolute text-gray-400 text-lg left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type={showPassword ? "password" : "text"}
                    id="password"
                    value={password}
                    placeholder="Enter Password"
                    required
                    className="pl-10"
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                  />
                  {showPassword ? (
                    <FaRegEyeSlash
                      className="text-gray-400 cursor-pointer absolute right-4 top-1/2 transform -translate-1/2"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <FaRegEye
                      className="text-gray-400 cursor-pointer absolute right-4 top-1/2 trnasfopm -translate-1/2"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>

                {/* horizontal role */}
                <div className="mt-8 w-full flex items-center">
                  <hr className="border-gray-400 flex-grow" />
                  <span className="mx-4 text-sm text-gray-500">or login with</span>
                  <hr className="border-gray-400 flex-grow" />
                </div>

                {/* Social login buttons */}
                <div className="w-full flex items-center justify-between py-2">
                  <div onClick={handleSocialLogin} className="p-2 md:px-6 bg-none cursor-pointer rounded-xl hover:bg-slate-300">
                    <FaGoogle className="text-2xl md:text-xl text-slate-800" />
                  </div>

                  <div onClick={handleSocialLogin} className="p-2 md:px-6 bg-none cursor-pointer rounded-xl hover:bg-slate-300">
                    <FaLinkedin className="text-2xl md:text-xl text-slate-800" />
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full p-3 bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] rounded-xl mt-3 cursor-pointer text-sm md:text-base text-white font-semibold"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
           </form>
          </TabsContent>

          <TabsContent value="signup">
            <Toaster />
            <form onSubmit={handleSignin}>
            <Card className="max-w-lg mx-auto p-6 bg-white rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>
                  <h2 className="font-bold text-2xl md:text-3xl text-center mb-2">
                    New here?<br />
                    Let’s start this amazing journey together — it'll be worth it!
                  </h2>
                </CardTitle>

                <CardDescription>
                  <p className="mb-2 text-sm md:text-sm text-gray-400 text-center">
                    Get started with ResumeX
                  </p>
                  <p className="font-semibold md:text-sm text-gray-400 text-center">
                    Already have an account?{" "}
                    <span className="text-black underline cursor-pointer">
                      <a href="#">Login</a>
                    </span>
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Email field */}
                <div className="space-y-1 relative">
                  <MdAlternateEmail className="absolute text-gray-400 text-lg  left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    id="email"
                    placeholder="Enter Email"
                    required
                    value={email}
                    className="pl-10"
                    onChange={(e)=>{
                      setEmail(e.target.value)
                    }
                    }
                  />
                </div>

                <div className="flex flex-col space-y-4 py-2">
                  <div className="flex items-center col-auto space-x-2">
                    <Checkbox id="terms" required/>
                    <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Accept terms and conditions & privacy policy
                    </label>
                  </div>

                  <div className="flex items-center col-auto space-x-2">
                    <Checkbox id="privacy"/>
                    <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Accept to receive newsletters & updates to your mail
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>

      
              <div className="grid w-full">
              <Button
                  type="submit"
                  className="w-full p-3 rounded-xl mt-3 text-sm md:text-base text-white font-semibold bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] cursor-pointer"
                >
                  SignUp
                </Button>
              </div>

              
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LoginSignup;
