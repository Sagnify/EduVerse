import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

const Current = () => {
  return (
    <div className="group/post space-y-3 rounded-2xl mt-5 w-[20rem] bg-card py-5 shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">
            Analog and Digital Electronics
          </CardTitle>
          <CardDescription>Finished 12/69 </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Image
            src="/images/ZWdT-6Ld71Q-HQ.jpg"
            alt="Analog and Digital Electronics"
            width={480}
            height={480}
            className=" rounded-3xl"
          />
        </CardContent>
        <CardFooter className='flex w-full justify-end'>
          <Button>
            <Link href="/courses/1">Continue</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Current