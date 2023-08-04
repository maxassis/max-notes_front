import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet, Form, useActionData, Link } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { getSession } from "~/session.server";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { useState } from "react";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...sideStyle() ];
}

const schema = z.object({
  content: z.string().nonempty().trim()
})

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token;

  if (!session.data.token) {
    return redirect("/login");
  }

return fetch("http://localhost:3333/auth/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + authorization,
    }
  }).then((response) => response.json())
 // .then((data) => console.log(data))

}

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  //console.log(data);
  
  if (!schema.safeParse(data).success) {
    console.log("deu ruim");

    return schema.safeParse(data);
  }

  return redirect(`/notes/search/${data.content}`);
}

export default function Notes() {
  const [input, setInput] = useState<string>("")
  const [menu, setMenu] = useState<boolean>(false)
  const data = useActionData()

  return (
    <div className="notes">
      <header className="notes__header">
      <div className="header">
        {!menu ? (
        <svg onClick={() => setMenu(!menu)} className="header__icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
            <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3z"/>
        </svg>
        ) : (
        <svg className="header__icon" onClick={() => setMenu(!menu)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeWidth="2" d="m3 3 18 18M3 21 21 3"/>
        </svg>
        )}
        <Form method="POST" className="header__form"> 
          <div style={{position: "relative"}}> 
            <input value={input} onChange={(e) => setInput(e.target.value)} className="header__input" placeholder="Pesquisar" name="content" />
            <Link to="/notes/show" 
            className={"header__clear-icon " + (input !== "" ? "header--hidden-icon" : "")}
            onClick={() => setInput("")}
            >
            <svg className="header__close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M4.99 3.99a1 1 0 0 0-.697 1.717L10.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 1 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 0 0-.727-1.717 1 1 0 0 0-.687.303L12 10.586 5.707 4.293a1 1 0 0 0-.717-.303z"/>
            </svg>
            </Link>
          </div>
          {data?.error ? <span className="header--error">campo obrigatorio</span> : null}             
        </Form>
        </div>
      </header>

      <aside className="notes__aside">
        <Side />
      </aside>

      <main className="notes__main">
        <div className={"menu-mobile__wrapper " + (menu ? "menu-mobile--show-wrapper"  : "")} onClick={() => setMenu(false)}>
          <h1 className={"menu-mobile " + (menu ? "menu-mobile--show"  : "")}></h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
