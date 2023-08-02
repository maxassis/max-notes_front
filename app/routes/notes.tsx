import Side, { links as sideStyle } from "~/components/Side";
import styles from "../styles/notes.css";
import { Outlet, Form, useActionData } from "@remix-run/react";
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
  
  if (!schema.safeParse(data).success) {
    console.log("deu ruim");

    return schema.safeParse(data);
  }

  return redirect(`/notes/search/${data.content}`);
}

export default function Notes() {
  const [input, setInput] = useState<string>("")
  const data = useActionData()
  
  return (
    <div className="notes">
      <header className="notes__header">
      <div className="header">
            <Form method="POST">
                <input value={input} onChange={(e) => setInput(e.target.value)} className="header__input" placeholder="Pesquisar" name="content" />
            </Form>
            {data?.error ? <span className="header--error">campo obrigatorio</span> : null}
        </div>
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
