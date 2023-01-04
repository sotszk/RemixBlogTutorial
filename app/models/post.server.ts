import type { Post } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function CreatePost(
  post: Pick<Post, "title" | "slug" | "markdown">
) {
  return prisma.post.create({ data: post });
}

export async function UpdatePost(
  slug: string,
  post: Pick<Post, "title" | "slug" | "markdown">
) {
  return prisma.post.update({ where: { slug }, data: post });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
