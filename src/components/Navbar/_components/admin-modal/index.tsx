"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Riders from './_components/riders'
import Unapproved from './_components/unapproved'


type Props = {
    children : React.ReactElement
  
}

const AdminModal = ({children}: Props) => {
  return (
    <Dialog>
    <DialogTrigger className='cursor-pointer'>
        {children}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Admin Modal</DialogTitle>
        <DialogDescription>
         This will allow admin to control the platform
        </DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="riders" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="riders">
        Riders
    </TabsTrigger>
    <TabsTrigger value="unapproved">UnApproved</TabsTrigger>
  </TabsList>
  <TabsContent value="riders">
    <Riders  />
  </TabsContent>
  <TabsContent value="unapproved">
  <Unapproved />
  </TabsContent>
</Tabs>


    </DialogContent>
  </Dialog>
  
  )
}

export default AdminModal