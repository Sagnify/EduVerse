import LeftBar from "@/components/LeftBar";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50">
        <Navbar />
      </nav>

      {/* Main content area */}
      <div className="flex flex-1 mt-16 md:px-12">
        {/* Sticky LeftBar */}
        <aside className="sticky top-16 w-72 h-[90vh] flex items-center">
          <LeftBar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-12">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
