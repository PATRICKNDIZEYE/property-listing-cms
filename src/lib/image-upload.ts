import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function saveImage(file: File, folder: string = 'uploads'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate image type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid image type. Only JPEG, PNG, WebP, and GIF are allowed.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (buffer.length > maxSize) {
    throw new Error('Image size exceeds 5MB limit.');
  }

  // Create directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', folder);
  await mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${randomString}.${extension}`;
  const filepath = join(uploadDir, filename);

  // Handle GIF files separately - Sharp doesn't preserve animation
  // Save GIF files directly without processing to preserve animation
  if (file.type === 'image/gif') {
    await writeFile(filepath, buffer);
  } 
  // Optimize and save other image formats
  else if (file.type === 'image/png') {
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85 })
      .toFile(filepath);
  } else if (file.type === 'image/webp') {
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);
  } else {
    // JPEG and other formats
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filepath);
  }

  return `/${folder}/${filename}`;
}

export async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  return formData;
}

