"use client";
import { UploadButton, UploadDropzone, Uploader } from "@/libs/uploadthing";
import { FileText, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const { handleSubmit, register, reset } = useForm();
  async function onSubmit(data) {
    data.productImageUrl = imageUrl;
    data.pdfUrl = pdfUrl;
    console.log(data);
  }
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
    </div>
  );
}
