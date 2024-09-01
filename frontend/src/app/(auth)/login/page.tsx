import React from "react";
import Login from "./loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Login",
    default: "EduVerse",
  },
  description: "Very much a beta app",
};

const page = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default page;
