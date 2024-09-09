"use client";
import { Button } from "@/components/ui/button";
import useUserFetcher from "@/core/fetchUser";
import { Pencil } from "lucide-react";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUserFetcher();

  return (
    <main className="">
      {children}
      {!user?.profile.is_teacher && (
        <Button
          variant={"outline"}
          size={"lg"}
          className="fixed bottom-20 right-20 flex gap-2 items-center px-2"
          onClick={() => alert("Button Clicked!")}
        >
          <Pencil size={20} />
          Add to Library
        </Button>
      )}
    </main>
  );
};

export default Layout;
