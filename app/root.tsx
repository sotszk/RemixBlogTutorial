import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from '@remix-run/node';
import {
    Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData
} from '@remix-run/react';

import { getEnv } from './env.server';
import { getUser } from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>;
};

export async function loader({ request }: LoaderArgs) {
  return json<LoaderData>({
    user: await getUser(request),
    ENV: getEnv(),
  });
}

export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        ></script>
        <LiveReload />
      </body>
    </html>
  );
}
