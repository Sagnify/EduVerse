"use client"
import { useEffect, useState } from "react";
import { z } from "zod";
import { loginUser } from "./actions/login";
import { useForm } from "react-hook-form";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the schema for the form using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if we are in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/home");
      }
    }
  }, [router]);

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
      router.push("/home");
    } else {
      setErrorMessage(result.message);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center text-center w-full h-screen p-5 bg-gradient-to-r from-violet-700 to-pink-200">
      <Card className="p-5 w-96 shadow-xl border-0">
        <CardHeader>
          <CardHeader className="text-3xl font-bold m-0 p-0">Login</CardHeader>
          <CardDescription className="font-bold">
            Login to your account to access.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(submitHandler)}>
          {errors.username && (
            <p className="text-red-400 mb-2 text-xs font-bold">
              {errors.username.message}
            </p>
          )}
          <div className="mb-4">
            <Input
              id="username"
              {...register("username")}
              placeholder="Username"
              className="form-control bg-white/10 backdrop-blur-xl "
            />
          </div>

          <div className="mb-4">
            {errors.password && (
              <p className="text-red-400 mb-2 text-xs font-bold">
                {errors.password.message}
              </p>
            )}
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password")}
              className="form-control bg-white/10 backdrop-blur-xl "
            />
          </div>

          <Button
            type="submit"
            className="btn btn-primary btn-block mb-4 font-bold w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <Link href="/signup" className="text-sm text-blue-500">
            {`Don't have an account?`}
          </Link>
        </form>

        {successMessage && (
          <>
            <hr className="mt-5" />
            <Alert variant="default" className="mt-3 w-full">
              {successMessage}
            </Alert>
          </>
        )}
        {errorMessage && (
          <>
            <hr className="mt-5" />
            <Alert variant="destructive" className="mt-3 w-full">
              {errorMessage}
            </Alert>
          </>
        )}
      </Card>
    </div>
  );
}
