import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet } from "@remix-run/react";
import Header, { links as headerStyle } from '~/components/Header';
import type { LoaderArgs } from "@remix-run/node";
import { getSession } from "~/session.server";
import { redirect } from "@remix-run/node";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...sideStyle(), ...headerStyle() ];
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token;

  if (!session.data.token) {
    return redirect("/login");
  }

  const res = await fetch("http://localhost:3333/posts", {
    headers: { Authorization: "bearer " + authorization },
  });

  return res.json();
}


export default function Notes() {
//  const data = useLoaderData()
 // console.log(data)
  
  return (
    <div className="notes">
      <header className="notes__header">
        <Header />
      </header>

      <aside className="notes__aside">
        <Side />
      </aside>

      <main className="notes__main">
        <Outlet />
      </main>
    </div>
  );
}
