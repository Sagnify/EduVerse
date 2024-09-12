import React from "react";
import { Card, CardDescription, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Current = () => {
  return (
    <div className="group/post rounded-2xl mt-5 w-[20rem] bg-card py-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <Card>
        <CardTitle className="font-bold px-3 pt-2">
          Analog and Digital Electronics
        </CardTitle>
        <CardDescription className="px-3">Finished 12/69 </CardDescription>
        <Image
          src="/images/ZWdT-6Ld71Q-HQ.jpg"
          alt="Analog and Digital Electronics"
          width={480}
          height={480}
          className=" rounded-3xl"
        />
        <CardFooter className="flex w-full justify-end">
          <Button>
            <Link href="/courses/1">Continue</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Current;
