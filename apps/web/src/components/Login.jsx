import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '../services/operations/authAPI';

import {
  FaFingerprint,
  FaRegEye,
  FaRegEyeSlash,
  FaGoogle,
  FaLinkedin,
} from 'react-icons/fa';

import { MdAlternateEmail } from 'react-icons/md';
import { toast, Toaster } from 'sonner';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSocialLogin = () => {
    toast('Coming soon to ease your experience');
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

  return (
    <form className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-4 sm:px-2">
      <Toaster />
      <Card className="shadow-xl w-md max-w-3xl sm:max-w-2xl p-6">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            <span className='text-3xl'>Welcome back, legend!</span> <br />
            Let’s pick up right where you left off.
          </CardTitle>

          <CardDescription className="space-y-2">
            <p className="mt-2 text-sm md:text-sm text-gray-400 text-center">
              Don't have an account?{' '}
              <span className="text-black underline cursor-pointer">
                <Link to="/signup">Sign up</Link>
              </span>
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="space-y-1 relative mt-1  w-full max-w-sm sm:max-w-md">
              <MdAlternateEmail className="absolute text-gray-400 text-lg  left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                id="email"
                placeholder="Enter Email"
                required
                className="pl-10"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1 relative w-full max-w-sm sm:max-w-md">
              <FaFingerprint className="absolute text-gray-400 text-lg left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter Password"
                required
                className="pl-10 max-w-xl"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FaRegEye
                  className="text-gray-400 cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <FaRegEyeSlash
                  className="text-gray-400 cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>

            <Button
              className="w-full max-w-md p-3 bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] rounded-xl mt-3 cursor-pointer text-sm md:text-base text-white font-semibold"
              onClick={handleLogin}
              type="submit"
              aria-label="Login"
            >
              Login
            </Button>

            <div className="mt-2 w-full flex items-center">
              <hr className="border-gray-300 flex-grow" />
              <span className="mx-4 text-sm text-gray-500">or login with</span>
              <hr className="border-gray-300 flex-grow" />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full flex items-center justify-center py-1">
            <div
              onClick={handleSocialLogin}
              className="p-2 md:px-6 bg-none cursor-pointer rounded-xl hover:bg-slate-300"
            >
              <FaGoogle className="text-xl sm:text-2xl text-slate-800" />
            </div>

            <div
              onClick={handleSocialLogin}
              className="p-2 md:px-6 bg-none cursor-pointer rounded-xl hover:bg-slate-300"
            >
              <FaLinkedin className="text-xl sm:text-2xl text-slate-800" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}

export default Login;
