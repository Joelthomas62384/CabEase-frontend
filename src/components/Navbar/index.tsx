
"use client"
import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CarFront } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { Button } from '../ui/button';
import LoginSignUpModal from './_components/login-signup';
import ProfilePopOver from './_components/profile-popover';
import CabRegister from './_components/cab-register';
import AdminModal from './_components/admin-modal';

const Navbar = () => {

  const {user , isLoggedIn} = useSelector((state:RootState)=>state.user)
  return (
    <nav className="flex items-center justify-between px-16 py-4 bg-[#2c3e50] shadow-md">
      <div className="text-xl flex items-center gap-1 font-bold text-white select-none">
        <span className='text-yellow-500'>
          <CarFront />
        </span>
       <div>
       <span className='text-yellow-500'>
        Cab
        </span>
       <span className='text-yellow-50'> 
       Ease
       </span>
       </div>
        </div>
      
     <div className='flex items-center gap-3'>
      <Link className='text-yellow-50 font-bold hover:text-yellow-400 transition'  href={'/'}>Home</Link>
      <Link className='text-yellow-50 font-bold hover:text-yellow-400 transition'  href={'/booking'}>Booking</Link>
{   !user.is_driver &&   <CabRegister children={<span className='text-yellow-50 font-bold hover:text-yellow-400 transition'>Cab Register</span>}/>}
     {
      user.is_superuser && <AdminModal children={<span className='text-yellow-50 font-bold hover:text-yellow-400 transition'>Admin</span>}/> 
     }
    
{ isLoggedIn && user ?
    ( <ProfilePopOver>
      <Avatar className='cursor-pointer shadow-amber-50 select-none'>
        <AvatarImage src="/user-avatar.png" alt="User Avatar" />
        <AvatarFallback className='text-white bg-amber-700'>JD</AvatarFallback>
      </Avatar>
    </ProfilePopOver>
    ) :
      (
        <LoginSignUpModal>

        <Button className=' bg-yellow-300 shadow-2xl text-black hover:bg-yellow-400 cursor-pointer '>Login</Button>
        </LoginSignUpModal>
      )
      
    }
     </div>
    </nav>
  );
};

export default Navbar;
