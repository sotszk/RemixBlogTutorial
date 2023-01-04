import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <main>
      <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-blue-800 underline">
          Back to top
        </Link>

        <div>
          <Link to="admin" className="text-red-600 underline">
            Admin
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-blue-600">Posts</h1>

        <ul className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <li key={post.slug} className="border border-cyan-400">
              <Link
                to={post.slug}
                className="block p-8 text-blue-400 underline hover:no-underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
