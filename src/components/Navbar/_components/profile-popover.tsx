import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import axiosInstance from '@/axios'
import { useDispatch } from 'react-redux'
import { initialState, setLoggedIn, setUser } from '@/Redux/Slices/userSlice'
import { toast } from 'sonner'
  
  

type Props = {
    children : React.ReactElement
}

const ProfilePopOver = ({children}: Props) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async ()=>{
        const response = await axiosInstance.post('user/logout')
        if (response.status === 200){
            dispatch(setUser(initialState))
            dispatch(setLoggedIn(false))
            
            toast.success("User Successfully logged out",{
                description : "User has been successfully logged out",
                
            })
            

            
            router.push('/')

            
        }
    }
  return (
    <>
<DropdownMenu>
  <DropdownMenuTrigger>
    {children}
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    
    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu>


    </>
  )
}

export default ProfilePopOver