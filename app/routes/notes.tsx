import styles from "../styles/notes.css";
import { links as cardStyle } from "../components/card";
import { links as showStyle } from "./notes.show";
import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...cardStyle(), ...showStyle()];
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token

  if (!session.data.token) {
    return redirect("/login");
  }

  const res = await fetch("http://localhost:3333/posts", {
    headers: { "Authorization": "bearer " + authorization}
  });

  return await res.json();
}

export default function Notes() {
  
  return (
    <div className="notes">
      <header></header>

      <aside></aside>

      <main className="notes__main">
        <Outlet />
      </main>
    </div>
  );
}
