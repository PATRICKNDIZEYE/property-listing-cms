"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onUploadSuccess?: (image: {
    id: string;
    url: string;
    filename: string;
  }) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Image uploaded successfully");
        if (onUploadSuccess) {
          onUploadSuccess(data.image);
        }
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? "border-primary bg-primary/5"
          : "border-border dark:border-dark_border"
      }`}
    >
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <Icon
          icon="ion:cloud-upload-outline"
          width={48}
          height={48}
          className="text-primary"
        />
        <div>
          <span className="text-primary font-medium">Click to upload</span> or
          drag and drop
        </div>
        <div className="text-sm text-gray dark:text-gray">
          PNG, JPG, GIF, WebP up to 5MB
        </div>
        {uploading && <div className="text-primary">Uploading...</div>}
      </label>
    </div>
  );
}
