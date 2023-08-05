import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet, Form, useActionData, Link } from "@remix-run/react";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { getSession } from "~/session.server";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { useState } from "react";

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...sideStyle()];
}

const schema = z.object({
  content: z.string().nonempty().trim(),
});

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
    },
  }).then((response) => response.json());
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
  const [input, setInput] = useState<string>("");
  const [menu, setMenu] = useState<boolean>(false);
  const data = useActionData();

  return (
    <div className="notes">
      <header className="notes__header">
        <div className="header">
          {!menu ? (
            <svg
              onClick={() => setMenu(!menu)}
              className="header__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
            >
              <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2H3z" />
            </svg>
          ) : (
            <svg
              className="header__icon"
              onClick={() => setMenu(!menu)}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                d="m3 3 18 18M3 21 21 3"
              />
            </svg>
          )}
          <Form method="POST" className="header__form">
            <div style={{ position: "relative" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="header__input"
                placeholder="Pesquisar"
                name="content"
              />
              <Link
                to="/notes/show"
                className={
                  "header__clear-icon " +
                  (input !== "" ? "header--hidden-icon" : "")
                }
                onClick={() => setInput("")}
              >
                <svg
                  className="header__close-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path d="M4.99 3.99a1 1 0 0 0-.697 1.717L10.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 1 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 0 0-.727-1.717 1 1 0 0 0-.687.303L12 10.586 5.707 4.293a1 1 0 0 0-.717-.303z" />
                </svg>
              </Link>
            </div>
            {data?.error ? (
              <span className="header--error">campo obrigatorio</span>
            ) : null}
          </Form>
        </div>
      </header>

      <aside className="notes__aside">
        <Side />
      </aside>

      <main className="notes__main">
        <div
          className={
            "menu-mobile__wrapper " + (menu ? "menu-mobile--show-wrapper" : "")
          }
          onClick={() => setMenu(false)}
        >
          <div className={"menu-mobile " + (menu ? "menu-mobile--show" : "")}>       
              <div>
                <Link to="/notes/show">
                  <div className="side__single-item">
                    <div className="side__icon-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19.82 14H15.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C14 14.76 14 15.04 14 15.6v4.22m6-7.093V7.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C18.48 4 17.92 4 16.8 4H7.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.52 20 6.08 20 7.2 20h5.75c.508 0 .762 0 1-.06a2 2 0 0 0 .595-.256c.207-.132.381-.317.73-.686l3.85-4.073c.324-.342.485-.513.6-.71.103-.174.178-.363.224-.56.051-.223.051-.458.051-.928Z"
                        />
                      </svg>
                      <span>Notas</span>
                    </div>
                  </div>
                </Link>

                <Link to={`/notes/trash/1`}>
                <div className="side__single-item">
                  <div className="side__icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="-3 0 32 32"
                    >
                      <path
                        fill="#000"
                        fillRule="evenodd"
                        d="M23 8H3a1 1 0 1 1 0-2h20a1 1 0 0 1 0 2Zm-1 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10h18v18ZM10 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h-6V3Zm14 1h-6V2a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v18a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM13 28a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Zm-5 0a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Zm10 0a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Z"
                      />
                    </svg>
                    <span>Lixeira</span>
                  </div>
                 </div> 
                </Link>
              </div>

              <Link to="/logout" prefetch="intent" style={{ marginBottom: "15px"}}>
                <div className="side__logout" style={{ borderRadius: "0" }}>
                  <div className="side__icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="-3 0 32 32"
                    >
                      <path
                        fill="#fff"
                        fillRule="evenodd"
                        d="M23 8H3a1 1 0 1 1 0-2h20a1 1 0 0 1 0 2Zm-1 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10h18v18ZM10 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h-6V3Zm14 1h-6V2a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2v18a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM13 28a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Zm-5 0a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Zm10 0a1 1 0 0 0 1-1V15a1 1 0 0 0-2 0v12a1 1 0 0 0 1 1Z"
                      />
                    </svg>
                    <span style={{ color: "#fff" }}>Sair</span>
                  </div>
                </div>
              </Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
