import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';
import sharp from 'sharp';

export async function saveImage(file: File, folder: string = 'uploads'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate image type - check both MIME type and file extension
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  
  const fileType = file.type?.toLowerCase() || '';
  const fileName = file.name?.toLowerCase() || '';
  const fileExtension = fileName.split('.').pop() || '';
  
  // Check MIME type first, then fall back to file extension
  const isValidType = allowedTypes.includes(fileType) || allowedExtensions.includes(fileExtension);
  
  if (!isValidType) {
    console.error('Invalid file type:', {
      mimeType: file.type,
      fileName: file.name,
      extension: fileExtension,
    });
    throw new Error(`Invalid image type (${file.type || 'unknown'}). Only JPEG, PNG, WebP, GIF, and AVIF are allowed.`);
  }
  
  // Determine actual MIME type for processing
  let actualType = fileType;
  if (!actualType && fileExtension) {
    // Map extension to MIME type
    const extensionMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'avif': 'image/avif',
    };
    actualType = extensionMap[fileExtension] || 'image/jpeg';
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
  // Use file extension if available, otherwise determine from MIME type
  let extension = fileExtension || 'jpg';
  if (!extension && actualType) {
    const typeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/avif': 'avif',
    };
    extension = typeToExt[actualType] || 'jpg';
  }
  const filename = `${timestamp}-${randomString}.${extension}`;
  const filepath = join(uploadDir, filename);

  // Handle GIF files separately - Sharp doesn't preserve animation
  // Save GIF files directly without processing to preserve animation
  if (actualType === 'image/gif') {
    await writeFile(filepath, buffer);
  } 
  // Optimize and save other image formats
  else if (actualType === 'image/png') {
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85 })
      .toFile(filepath);
  } else if (actualType === 'image/webp') {
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);
  } else if (actualType === 'image/avif') {
    await sharp(buffer)
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .avif({ quality: 85 })
      .toFile(filepath);
  } else {
    // JPEG and other formats (default to JPEG)
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

