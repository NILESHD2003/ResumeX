import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from 'react';
import { signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function CreateAccount() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const navigate = useNavigate();
    const magicLink = useSelector(state => state.auth.magicLink)
    console.log(magicLink);

    function handleCreateAccount(event) {
        event.preventDefault(); // prevent page reload on form submit
    
        if ((password === confirmPassword) && (password.length > 6 && confirmPassword.length > 6)) {
            console.log("working");
            signUp(username, password, confirmPassword, navigate, magicLink);
        } else {
            toast.error('Passwords need to match');
        }
    }

    useEffect(() => {
        console.log(username, password, confirmPassword)
    }, [username, password, confirmPassword])

    return (
        <form onSubmit={handleCreateAccount}>
            <Toaster />
            <Card className="max-w-2xl w-sm mx-auto bg-white rounded-3xl shadow-sm">
                <CardHeader>
                    <CardTitle>
                        <h1>
                            Create Account
                        </h1>
                    </CardTitle>
                    <CardDescription>
                        Enter details to create account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1'>
                        <div className='col-span-1 w-full py-1'>
                            <Input
                                className='col-span-1'
                                required
                                id='name'
                                value={username}
                                placeholder='Enter Username'
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-span-1 w-full py-1'>
                            <Input
                                className='col-span-1'
                                id='password'
                                required
                                value={password}
                                placeholder='Enter Password'
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <div className='col-span-1 w-full py-1'>
                            <Input
                                className='col-span-1'
                                required
                                id='confirmPassword'
                                value={confirmPassword}
                                placeholder='Confirm Password'
                                onChange={(e) => {
                                    setconfirmPassword(e.target.value)
                                }}
                            />
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
    )
}