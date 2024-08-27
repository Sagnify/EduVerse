"use client";
import { useState } from "react";
import { z } from "zod";
import { loginUser } from "./actions/login";
import { useForm } from "react-hook-form";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema for the form using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  async function submitHandler(data: LoginFormInputs) {
    setIsLoading(true);
    setErrorMessage("");

    const result = await loginUser(data);

    if (result.success) {
      setSuccessMessage(result.message);
      // Redirect to /mytodos
      window.location.href = "/";
      console.log("Login successful!");
    } else {
      setErrorMessage(result.message);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center text-center w-full h-screen p-5 bg-gradient-to-r from-violet-600 to-indigo-600">
      <Card className=" p-5 w-96 shadow-xl bg-white/10 backdrop-blur-xl border-0">
        <CardHeader>
          <CardHeader className="text-3xl font-bold m-0 p-0 text-background">Login</CardHeader>
          <CardDescription className="text-foreground">
            Login to your account to access.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          {errors.username && (
            <p className="text-red-400">{errors.username.message}</p>
          )}
          <div className="mb-4">
            {/* <Label htmlFor="username">Username</Label> */}
            <Input
              id="username"
              {...register("username")}
              placeholder="Username"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            {/* <Label htmlFor="password">Password</Label> */}
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <Button
            type="submit"
            className="btn btn-primary btn-block mb-4"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {successMessage && (
          <Alert variant="default" className="mt-3 w-full">
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="destructive" className="mt-3 w-full">
            {errorMessage}
          </Alert>
        )}
      </Card>
    </div>
  );
}
