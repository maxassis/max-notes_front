//import { cssBundleHref } from "@remix-run/css-bundle";
//import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from '~/styles/reset.css'

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];

export function links(){
  return [{rel: "stylesheet", href: styles}, {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;900&display=swap',
  }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
