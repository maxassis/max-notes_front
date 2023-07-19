import styles from "../styles/login.css";
import { Link, Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { getSession, commitSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const schema = z.object({
    name: z.string().min(1),
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
   
    console.log("deu bom");
    const token = fetch("http://localhost:3333/auth/register", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      }),
    })
      .then((r) => r.json())
      .then((json) => json.accesstoken);
   
    const session = await getSession(request.headers.get("Cookie"));
    session.set("token", await token);
    //console.log(session.data);
   
    return redirect("/notes", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }


export default function Login() {
  return (
    <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">Registro</h2>
        <h3 className="login__subtitle">Bem vindo</h3>

        <Form method="POST">
          <div className="login__input-wrapper">
            <input
              className="login__input-user input"
              type="text"
              placeholder="Username"
              name="name"
            />
            <span className="login__error">A senha deve possuir no minimo 6 letras</span>
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-email input"
              placeholder="Email"
              name="email"
            />
            <span className="login__error">A senha deve possuir no minimo 6 letras</span>
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-password input"
              type="password"
              name="password"
              placeholder="Senha"
            />
            <span className="login__error">A senha deve possuir no minimo 6 letras</span>
          </div>

          <div className="login__checkbox">
            <input type="checkbox" />
            <span>Aceito os termos e condições</span>
          </div>

          <button className="login__button" style={{ marginTop: "1.84rem" }}>
            Continue
          </button>
        </Form>

        <Link to="/login">
          <h4 className="login__forgot">
            Já tem uma conta ? <span>Login</span>
          </h4>
        </Link>
      </div>
    </div>
  );
}
