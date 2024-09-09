"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "../ui/alert";
import { addLibrary } from "@/core/addLibrary";

// Define the schema for the form using Zod
const formSchema = z.object({
  visibility: z.boolean().default(true),
  asset_url: z.string().url("Invalid URL").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  stream: z.string().optional(),
  subject: z.string().optional(),
  standard: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function MyForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visibility: true,
    },
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading

  useEffect(() => {
    setValue("visibility", true);
  }, [setValue]);

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true); // Set loading state to true

    try {
      // Ensure asset_url is always a string, even if empty
      const payload = {
        ...data,
        asset_url: data.asset_url || "", // Ensure asset_url is never undefined
      };

      const result = await addLibrary(payload);

      if (result.success) {
        setSuccessMessage("Form submitted successfully!");
        // Redirect after successful submission
        router.push("/library");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="flex items-center justify-center text-center">
      <Card className="p-5 w-96 shadow-xl border-0">
        <CardHeader>
          <CardHeader className="text-3xl font-bold m-0 p-0">
            Submit Form
          </CardHeader>
          <CardDescription className="font-bold">
            Fill in the details below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            {/* Visibility field is not shown in the form, but is always true */}
            <Input
              type="hidden"
              id="visibility"
              value="true"
              {...register("visibility")}
            />
          </div>

          <div className="mb-4">
            {errors.asset_url && (
              <p className="text-red-400 mb-2 text-xs font-bold">
                {errors.asset_url.message}
              </p>
            )}
            <Input
              id="asset_url"
              {...register("asset_url")}
              placeholder="Asset URL"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            {errors.title && (
              <p className="text-red-400 mb-2 text-xs font-bold">
                {errors.title.message}
              </p>
            )}
            <Input
              id="title"
              {...register("title")}
              placeholder="Title"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            {errors.description && (
              <p className="text-red-400 mb-2 text-xs font-bold">
                {errors.description.message}
              </p>
            )}
            <Input
              id="description"
              {...register("description")}
              placeholder="Description"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            <Input
              id="stream"
              {...register("stream")}
              placeholder="Stream"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            <Input
              id="subject"
              {...register("subject")}
              placeholder="Subject"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <div className="mb-4">
            <Input
              id="standard"
              {...register("standard")}
              placeholder="Standard"
              className="form-control bg-white/10 backdrop-blur-xl"
            />
          </div>

          <Button
            type="submit"
            className="btn btn-primary btn-block mb-4 font-bold w-full"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Submitting..." : "Submit"} {/* Show loading text */}
          </Button>
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
