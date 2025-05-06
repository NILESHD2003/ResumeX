import React from 'react'
import { CreateAccount } from '../components/CreateAccount'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CreateAccountPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[#F1F0FB]'>
        <CreateAccount />
    </div>
  )
}
