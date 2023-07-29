import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet } from "@remix-run/react";
import Header, { links as headerStyle } from '~/components/Header';
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
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

  const decode = (token: string): string =>
    decodeURIComponent(
        atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );

  //console.log(JSON.parse(decode(authorization)));

  return JSON.parse(decode(authorization))
}

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  console.log(data);

  return null
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
