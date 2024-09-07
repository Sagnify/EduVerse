"use client"
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { postNewPost } from "@/core/post";

// Define the schema for the form using Zod
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.any().optional(), // Optional image upload
});

type PostFormInputs = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedImage(file);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormInputs>({
    resolver: zodResolver(postSchema),
  });

  async function submitHandler(data: PostFormInputs) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let imageUrl = "";

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch(
          "https://api.imgbb.com/1/upload?key=" +
            process.env.NEXT_PUBLIC_IMGBB_API_KEY,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          imageUrl = uploadData.data.url;
          console.log("Image URL:", imageUrl); // Log the image URL
        } else {
          throw new Error("Image upload failed");
        }
      }

      await postNewPost(data.title, imageUrl); // Call the utility function

      setSuccessMessage("Post created successfully!");
      router.push("/home");
    } catch (error) {
      let errorMessage = "Failed to create the post.";

      if (error instanceof Error) {
        errorMessage = error.message; // Use the message from the caught error
      } else if (error instanceof Response) {
        // Handle fetch errors
        const errorData = await error.json();
        errorMessage = errorData.message || errorMessage;
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="space-y-3 rounded-2xl mt-5 bg-card p-5 h-full shadow-[0_3px_15px_rgb(0,0,0,0.12)]">
      <span className="text-2xl font-bold">New Post</span>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="p-4 flex flex-col h-full"
      >
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Title"
            {...register("title")}
            className="w-full p-2 text-xl font-bold border-2 border-gray-200 rounded-md"
          />
          {errors.title && (
            <p className="text-red-400 mb-2 text-xs font-bold">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="mb-4 h-96">
          {!imagePreview && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="items-center flex h-full justify-center border-2 border-gray-200 rounded-md"
            />
          )}
          {imagePreview && (
            <div className="mt-2 flex">
              <Image
                src={imagePreview}
                alt="Image Preview"
                height={200}
                width={200}
                className=" rounded-md"
              />
              <Button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
                className="btn btn-secondary rounded-full m-2"
              >
                X
              </Button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="btn btn-primary btn-block font-bold w-fit mx-auto"
          disabled={isLoading}
        >
          {isLoading ? "Creating Post..." : "Create Post"}
        </Button>
      </form>

      {successMessage && (
        <p className="text-green-500 font-bold mt-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 font-bold mt-4">{errorMessage}</p>
      )}
    </div>
  );
}
