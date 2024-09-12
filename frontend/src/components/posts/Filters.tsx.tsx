import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const Filters = () => {
  return (
    <div className="group/post space-y-3 rounded-2xl bg-card w-full shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <Card className="py-2">
        <span className="text-center font-bold text-xl my-2 mb-1">
          Catagories
        </span>
        <div className="px-2">
          <div className="text-md font-bold">Science</div>
          <ul className=" items-center gap-1 my-2 ml-3">
            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Physics</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Chemistry</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Biology</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">others</Label>
            </li>
          </ul>
        </div>
        <div className="px-2">
          <div className="text-md font-bold">Commerce</div>
          <ul className=" items-center gap-1 my-2 ml-3">
            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accountancy</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Buisness Studies</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Economics</Label>
            </li>

            <li className="flex items-center gap-2 my-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">others</Label>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Filters;
