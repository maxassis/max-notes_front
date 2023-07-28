import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet } from "@remix-run/react";
import Header, { links as headerStyle } from '~/components/Header';

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...sideStyle(), ...headerStyle() ];
}

export default function Notes() {
  
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
