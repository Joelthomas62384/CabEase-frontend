import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./loginform";
import RegisterForm from "./registerform";

type Props = {
  children: React.ReactElement;
};

const LoginSignUpModal = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <LoginForm onSuccess={() => setIsOpen(false)} />
          </TabsContent>
          <TabsContent value="signup">
            <RegisterForm onSuccess={() => setIsOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignUpModal;
