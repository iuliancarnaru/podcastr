import { SignUp } from "@clerk/nextjs";
import React from "react";

function SignUpPage() {
  return (
    <div className="flex-center glassmorphism-auth h-screen w-full">
      <SignUp />
    </div>
  );
}

export default SignUpPage;
