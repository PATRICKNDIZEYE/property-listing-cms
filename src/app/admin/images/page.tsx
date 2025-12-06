"use client";
import { Metadata } from "next";
import ImageUpload from "@/app/components/admin/images/ImageUpload";
import ImageLibrary from "@/app/components/admin/images/ImageLibrary";

// export const metadata: Metadata = {
//   title: "Image Management",
// };

export default function ImagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-midnight_text dark:text-white">
          Image Library
        </h1>
        <p className="text-gray dark:text-gray mt-1">
          Upload and manage your images
        </p>
      </div>
      <div className="bg-white dark:bg-semidark p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold text-midnight_text dark:text-white mb-4">
          Upload New Image
        </h2>
        <ImageUpload onUploadSuccess={() => window.location.reload()} />
      </div>
      <ImageLibrary />
    </div>
  );
}
