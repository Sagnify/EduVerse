import Navbar from "@/components/Navbar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <nav className="fixed top-0 w-full">
        <Navbar />
      </nav>
      <div className="mt-16 pt-3 px-9 md:px-12">{children}</div>
    </div>
  );
};

export default layout;
