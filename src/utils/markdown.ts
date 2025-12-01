import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { prisma } from "@/lib/prisma";

const postsDirectory = join(process.cwd(), "markdown/blogs");

// Fallback functions for markdown files
function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory);
  } catch {
    return [];
  }
}

function getPostBySlugFromMarkdown(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string | object;
  };

  const items: any = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (field === "metadata") {
      items[field] = { ...data, coverImage: data.coverImage || null };
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

function getAllPostsFromMarkdown(fields: string[] = []) {
  try {
    const slugs = getPostSlugs();
    const posts = slugs
      .map((slug) => getPostBySlugFromMarkdown(slug, fields))
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
  } catch {
    return [];
  }
}

// Database functions
export async function getPostBySlug(slug: string, fields: string[] = []) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      // Fallback to markdown
      return getPostBySlugFromMarkdown(slug, fields);
    }

    const items: any = {};
    fields.forEach((field) => {
      if (field === "slug") {
        items[field] = blog.slug;
      }
      if (field === "content") {
        items[field] = blog.content;
      }
      if (field === "metadata") {
        items[field] = {
          title: blog.title,
          excerpt: blog.excerpt,
          coverImage: blog.coverImage,
          author: blog.author,
          date: blog.date,
        };
      }
      if (field === "title") items[field] = blog.title;
      if (field === "excerpt") items[field] = blog.excerpt;
      if (field === "coverImage") items[field] = blog.coverImage;
      if (field === "date") items[field] = blog.date;
    });

    return items;
  } catch (error) {
    // Fallback to markdown
    return getPostBySlugFromMarkdown(slug, fields);
  }
}

export async function getAllPosts(fields: string[] = []) {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
    });

    return blogs.map((blog) => {
      const items: any = {};
      fields.forEach((field) => {
        if (field === "slug") items[field] = blog.slug;
        if (field === "title") items[field] = blog.title;
        if (field === "excerpt") items[field] = blog.excerpt;
        if (field === "coverImage") items[field] = blog.coverImage;
        if (field === "date") items[field] = blog.date;
      });
      return items;
    });
  } catch (error) {
    // Fallback to markdown
    return getAllPostsFromMarkdown(fields);
  }
}
