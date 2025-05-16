import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonClickable, setButtonClickable] = useState(false);

  const magicLink = useSelector(state => state.auth.magicLink);
  const navigate = useNavigate();

  // Toggle functions
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // Validate input
  const handleValidation = () => {
    const isValid =
      username.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword;
    setButtonClickable(isValid);
  };

  useEffect(() => {
    handleValidation();
  }, [username, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    signUp(username, password, confirmPassword, navigate, magicLink);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <Card className="w-[90%] sm:w-[80%] md:w-[500px] lg:w-[500px] mx-auto bg-white rounded-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Create Account</CardTitle>
          <CardDescription>Enter your details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Username */}
          <div className="mb-4">
            <Input
              required
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <FaFingerprint className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaRegEye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaRegEyeSlash
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative mb-4">
            <FaFingerprint className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showConfirmPassword ? (
              <FaRegEye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={toggleConfirmPasswordVisibility}
              />
            ) : (
              <FaRegEyeSlash
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={toggleConfirmPasswordVisibility}
              />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!buttonClickable}
            className={`w-full p-3 rounded-xl text-sm md:text-base text-white font-semibold ${
              buttonClickable
                ? 'bg-gradient-to-r from-[#1C7EFF] to-[#CA79FF] cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default CreateAccount;
