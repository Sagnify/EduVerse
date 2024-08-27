"use client";
// signup/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions/signup";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const RoleSchema = z.object({
  role: z.enum(["student", "teacher"], {
    required_error: "You need to select either Student or Teacher.",
  }),
});

{/* 
          *TODO: To make a selector for gender, To add some icons for the is teacher/ student check box and make it more interactive
  */}

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("");
  const [standard, setStandard] = useState("");
  const [bio, setBio] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [role, setRole] = useState<"student" | "teacher" | "">("");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RoleSchema),
  });

  const handleNextStep = () => {
    setErrorMessage("");
    if (step === 1) {
      if (firstName && username && email && password) {
        setStep(step + 1);
      } else {
        setErrorMessage("Please fill in all required fields.");
      }
    } else if (step === 2) {
      if (role) {
        setStep(step + 1);
      } else {
        setErrorMessage("Please select a role.");
      }
    }
  };

  const handlePrevStep = () => {
    setErrorMessage("");
    setStep(step - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (step === 3) {
      if (
        role === "student" &&
        !(phoneNumber && address && gender && stream && standard)
      ) {
        setErrorMessage("Please fill in all required student fields.");
        setIsLoading(false);
        return;
      }

      if (role === "teacher" && !(phoneNumber && bio)) {
        setErrorMessage("Please fill in all required teacher fields.");
        setIsLoading(false);
        return;
      }

      try {
        await signup({
          username,
          firstName,
          lastName,
          email,
          password,
          isStudent: role === "student",
          isTeacher: role === "teacher",
          studentProfile:
            role === "student"
              ? { phoneNumber, address, gender, stream, standard }
              : undefined,
          teacherProfile: role === "teacher" ? { phoneNumber, bio } : undefined,
        });

        setSuccessMessage("Signup successful!");
        router.push("/");
      } catch (error) {
        setErrorMessage("Error signing up. Please try again.");
        console.error("Error signing up:", error);
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center text-center w-full h-screen p-5 bg-gradient-to-r from-violet-700 to-pink-200">
      <Card className="p-5 w-96 shadow-xl border-0">
        <CardHeader>
          <CardHeader className="text-3xl font-bold m-0 p-0">
            Sign Up
          </CardHeader>
          <CardDescription className="font-bold">
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="flex gap-2">
                <div className="mb-4">
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="form-control bg-white/10 backdrop-blur-xl"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="form-control bg-white/10 backdrop-blur-xl"
                  />
                </div>
              </div>
              <div className="mb-4">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="form-control bg-white/10 backdrop-blur-xl"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="form-control bg-white/10 backdrop-blur-xl"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="form-control bg-white/10 backdrop-blur-xl"
                  required
                />
              </div>
              <Button
                onClick={handleNextStep}
                className="btn btn-primary btn-block mb-4 font-bold w-full"
              >
                Next
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <CardTitle className="text-xl font-bold">
                        I am a...
                      </CardTitle>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setRole(value as "student" | "teacher");
                          }}
                          defaultValue={role}
                          className="flex flex-col space-y-1 items-center justify-center"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 w-fit p-3 bg-secondary rounded-sm">
                            <FormControl>
                              <RadioGroupItem value="student" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Student
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 w-fit p-3 bg-secondary rounded-sm">
                            <FormControl>
                              <RadioGroupItem value="teacher" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Teacher
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <div className="flex gap-2 mt-5">
                <Button
                  onClick={handlePrevStep}
                  className="btn btn-secondary w-full font-bold"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="btn btn-primary w-full font-bold"
                  disabled={!role} // Disable Next button until role is selected
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {role === "student" && (
                <>
                  <div className="mb-4">
                    <Input
                      id="phoneNumber"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      id="gender"
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder="Gender"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      id="stream"
                      type="text"
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      placeholder="Stream"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      id="standard"
                      type="text"
                      value={standard}
                      onChange={(e) => setStandard(e.target.value)}
                      placeholder="Standard"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>
                </>
              )}

              {role === "teacher" && (
                <>
                  <div className="mb-4">
                    <Input
                      id="phoneNumber"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Bio"
                      className="form-control bg-white/10 backdrop-blur-xl"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handlePrevStep}
                  className="btn btn-secondary font-bold w-full"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="btn btn-primary font-bold w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </>
          )}

          <Link href="/login" className="text-sm text-blue-500">
            {`Have an account?`}
          </Link>

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
        </form>
      </Card>
    </div>
  );
}
