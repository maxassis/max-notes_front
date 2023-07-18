import styles from "../styles/login.css";
import { useActionData, Form, Link } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { getSession, commitSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).trim(),
});

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  //console.log(data);

  if (!schema.safeParse(data).success) {
    console.log("deu ruim");

    return schema.safeParse(data);
  }

  const token = fetch("http://localhost:3333/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })
    .then((r) => r.json())
    .then((json) => json.accesstoken);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", await token);
  //console.log(session.data);

  return redirect("/register", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const data = useActionData();
  console.log(data);

  return (
    <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">Login</h2>
        <h3 className="login__subtitle">Bem vindo</h3>

        <Form method="POST">
          <div className="login__input-wrapper">
            <input
              className="login__input-user"
              placeholder="Email"
              id="user"
              name="email"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("email")) ? <span className="login__error">Insira um email valido</span> : null}
          </div>
          <div className="login__input-wrapper">
          <input
            className="login__input-email"
            type="password"
            placeholder="Password"
            id="pass"
            name="password"
          />
          {data?.error?.issues.some((item: any) => item.path.includes("password") ) ? <span className="login__error">A senha deve possuir no minimo 6 letras</span> : null}
          </div>
          <button className="login__button">Continue</button>
        </Form>

        <Link to="/register">
          <h4 className="login__forgot">
            Novo usuário ? <span>Registre-se</span>
          </h4>
        </Link>
      </div>
    </div>
  );
}
