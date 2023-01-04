import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { UpdatePost, getPost, deletePost } from "~/models/post.server";

export const action = async ({ request, params }: ActionArgs) => {
  invariant(params.slug, "params.slug is required");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/posts/admin");
  }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", () => "markdown must be a string");

  await UpdatePost(params.slug, { title, slug, markdown });

  return redirect("/posts/admin");
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "params.slug is required");

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export default function NewPost() {
  const errors = useActionData<typeof action>();
  const { post } = useLoaderData<typeof loader>();

  const transition = useTransition();
  const isUpdating = transition.submission?.formData.get("intent") === "update";
  const isDeleting = transition.submission?.formData.get("intent") === "delete";

  return (
    <Form method="post" key={post.slug}>
      <p>
        <label htmlFor="title">
          Post Title:
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={post.title}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
        </label>
      </p>
      <p>
        <label htmlFor="slug">
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={post.slug}
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            defaultValue={post.markdown}
            className="w-full rounded border border-gray-500 px-2 py-1 font-mono text-lg"
          />
        </label>
      </p>
      <p className="text-right">
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
            disabled={isDeleting}
          >
            Delete Post
          </button>
          <button
            type="submit"
            name="intent"
            value="update"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Post"}
          </button>
        </div>
      </p>
    </Form>
  );
}
