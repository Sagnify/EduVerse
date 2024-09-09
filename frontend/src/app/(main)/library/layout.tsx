"use client";
import { Button } from "@/components/ui/button";
import useUserFetcher from "@/core/fetchUser";
import { Pencil } from "lucide-react";
import Link from "next/link";
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
        <Link href="/library/new">
          <Button
            variant={"outline"}
            size={"lg"}
            className="fixed bottom-20 right-20 flex gap-2 items-center px-2"
          >
            <Pencil size={20} />
            Add to Library
          </Button>
        </Link>
      )}
    </main>
  );
};

export default Layout;
