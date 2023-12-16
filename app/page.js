"use client";
import { UploadButton, UploadDropzone, Uploader } from "@/libs/uploadthing";
import { FileText, Pencil, Plus } from "lucide-react";
import { OpenAI } from "openai";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt_text = `You are a highly knowledgeable ophthalmologist expert.
    Your task is to examine and diagnosis the disease may have the following image in detail.
    Provide a comprehensive, factual, and scientifically accurate explanation of what the image.
    Highlight key elements and their significance, and present your analysis in clear, well-structured markdown format.`;

export default function Home() {
  const [imageUrl, setImageUrl] = useState(
    "https://utfs.io/f/024715a8-4d69-46d0-bc91-7d175d513402-gcjq6e.jpg"
  );
  const [message, setMessage] = useState("");
  const { handleSubmit, register, reset } = useForm();

  const onSubmit = async () => {
    // Assuming you have an OpenAI API key

    try {
      // Make a request to OpenAI API
      const completions = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt_text,
              },
              {
                type: "image_url",
                image_url: imageUrl,
              },
            ],
          },
        ],
        model: "gpt-4-vision-preview",
        stream: false,
        max_tokens: 1200,
      });

      if (!completions.ok) {
        throw new Error(`OpenAI API error: ${completions.statusText}`);
      }

      const result = await completions.json();
      setMessage(result);

      // Do something with the OpenAI API result
      // For example, you can set the result in the state and display it to the user
    } catch (error) {
      console.error("Error calling OpenAI API:", error.message);
      // Handle errors accordingly
    }
  };

  return (
    <div className="w-full max-w-3xl p-8 my-16 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      <h2 className="text-4xl text-center font-semibold py-8">
        Upload your ophthalmology image, AI will assist you
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Title */}

          <div className="col-span-full">
            <div className="flex justify-between items-center mb-4">
              {imageUrl && (
                <button
                  onClick={() => setImageUrl("")}
                  type="button"
                  className="flex space-x-2  bg-slate-900 rounded-md shadow text-slate-50  py-2 px-4"
                >
                  <Pencil className="w-5 h-5" />
                  <span>Change Image</span>
                </button>
              )}
            </div>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Product image"
                width={1000}
                height={667}
                className="w-full h-64 object-cover"
              />
            ) : (
              <UploadDropzone
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  setImageUrl(res[0].fileUrl);
                  // Do something with the response
                  console.log("Files: ", res);
                  alert("Upload Completed");
                }}
                onUploadError={(error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 hover:bg-purple-800"
        >
          <span>Start Analyzing</span>
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}
