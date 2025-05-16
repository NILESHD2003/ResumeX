import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendMagicLink } from '../services/operations/authAPI';
// importing components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// icons
import { MdAlternateEmail } from 'react-icons/md';

// toast component
import { toast, Toaster } from 'sonner';
import NavBar from './NavBar';

function SignUp() {
  // sign in logic
  const [email, setEmail] = useState('');
  const [buttonClickable, setButtonClickable] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleSignin = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    else {
         dispatch(sendMagicLink(email, navigate));
         toast.success("Signing up...");
       }
     };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setButtonClickable(emailRegex.test(email) && agreedToTerms);
  }, [email, agreedToTerms]);

  return (
    <div>
      <Toaster />
      <NavBar/>
      <form
        onSubmit={handleSignin}
        className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-4 sm:px-2"
      >
        <Card className="shadow-xl w-md max-w-3xl sm:max-w-2xl p-6">
          <CardHeader>
            <CardTitle>
              <h2 className="font-bold text-2xl md:text-3xl text-center mb-2">
                New here?
                <br />
                Let’s start this amazing journey together — it'll be worth it!
              </h2>
            </CardTitle>
            <CardDescription className="space-y-2">
              <p className="mb-2 text-sm md:text-sm text-gray-400 text-center">
                Get started with ResumeX
              </p>
              <p className="font-semibold md:text-sm text-gray-400 text-center">
                Already have an account?{' '}
                <span className="text-black underline cursor-pointer">
                  <Link to="/login">Login</Link>
                </span>
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex flex-col items-center justify-center w-full gap-4">
              {/* Email field */}
              <div className="space-y-1 relative mt-1  w-full max-w-sm sm:max-w-md">
                <MdAlternateEmail className="absolute text-gray-400 text-lg  left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  id="email"
                  placeholder="Enter Email"
                  required
                  value={email}
                  className="pl-10"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Magic link */}


            <div className="flex flex-col space-y-4 items-center max-w-sm sm:max-w-md">
              
              {/* Checkbox Section */}
              <div className="flex items-center space-x-2 w-full ">
                <Checkbox
                  id="privacy"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked)}
                />
                <label
                  htmlFor="privacy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link
                    to="/privacy"
                    className="underline text-blue-400 hover:text-blue-800"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and the{' '}
                  <Link
                    to="/terms"
                    className="underline text-blue-400 hover:text-blue-800"
                  >
                    Terms and Conditions.
                  </Link>
                </label>
              </div>
            </div>

            <div className="flex items-center col-auto space-x-2 ">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I want to receive information about products, services, deals,
                and recommendations by ResumeX.
              </label>
            </div>
          </CardContent>

          <CardFooter>
             <div className="w-full max-w-sm sm:max-w-md">
              <Button
                type="submit"
                disabled={!buttonClickable}
                className={cn(
                  'w-full p-3 rounded-xl mt-3 text-sm md:text-base text-white font-semibold',
                  buttonClickable
                    ? 'bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                )}
              >
                SignUp
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default SignUp;
