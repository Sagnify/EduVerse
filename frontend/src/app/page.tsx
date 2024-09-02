// pages/index.js

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Button>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
};

export default HomePage;
