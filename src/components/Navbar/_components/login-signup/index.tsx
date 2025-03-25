import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import LoginForm from "../loginform";

type Props = {
  children: React.ReactElement;
};

const LoginSignUpModal = ({ children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle>Login / Sign Up</DialogTitle>
          <DialogDescription>
            Access your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
          <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <div className="p-4">

              
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignUpModal;
