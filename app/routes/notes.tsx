import styles from "../styles/notes.css";
import { Outlet } from "@remix-run/react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
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
