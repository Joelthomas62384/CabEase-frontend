
import React from 'react'
import { Spinner } from '../ui/Spinner'

type Props = {}

const LoadingPage = (props: Props) => {
  return (
    <div className="w-full min-h-full flex justify-center items-center overflow-hidden">
        <Spinner size={'large'}  className='text-[#2c3e50]'/>
    </div>
  )
}

export default LoadingPage