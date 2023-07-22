import styles from "../styles/notes.css";
import { links as cardStyle } from "../components/card";
import { links as showStyle } from "./notes.show";
import { Outlet } from "@remix-run/react";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...cardStyle(), ...showStyle()];
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
