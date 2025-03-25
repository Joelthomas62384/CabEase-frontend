import React from 'react'

type Props = {}

const Banner = (props: Props) => {
  return (
   <div className="w-[95%] h-46 rounded-xl bg-[#2c3e50] shadow-xl mx-auto mt-8 flex items-center justify-center">
     <h1 className="text-white text-center text-5xl font-bold">MY CAB SAVER</h1>
   </div>
  )
}

export default Banner