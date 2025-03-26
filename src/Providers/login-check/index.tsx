"use client"

import axiosInstance from '@/axios'
import LoadingPage from '@/components/loading-page'
import { setLoggedIn, setUser } from '@/Redux/Slices/userSlice'
import { RootState } from '@/Redux/store'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from 'typescript-cookie'

type Props = {
    children : React.ReactNode
}

const LoginCheck = ({children}: Props) => {

  const {user, isLoggedIn} = useSelector((state:RootState)=>state.user)
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(true)

  const fetchUser = async ()=>{
    const {data} = await axiosInstance.get('/user/me')
    return data
  }
  const {data , isLoading , isError} = useQuery({
    queryKey : ['user'],
    queryFn :fetchUser,
    enabled : shouldFetch 
  })

  
  useEffect(() => {
    const expiry = getCookie('expiry')
    if(expiry && (!user || !isLoggedIn)){
      setShouldFetch(true)

    }else{
      setLoading(false)
    
    }
    
    
  }, [user , isLoggedIn])

  useEffect(() => {
    if(data){
      dispatch(setUser(data))
      dispatch(setLoggedIn(true))
      setShouldFetch(false)
      setLoading(false)
    }
    
  }, [data])
  
  

    
  return (
   <>
   {
    loading ? (
     <div className='h-screen'>
       <LoadingPage />
     </div>
    ) : (
      children
    )
    
   }

   </>
  )
}

export default LoginCheck