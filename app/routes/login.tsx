import styles from "../styles/login.css";
import { useActionData, Form, Link, useNavigation } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { getSession, commitSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const schema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase().trim()),
  password: z.string().min(6).transform((password) => password.trim()),
});


export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  //console.log(data);

  if (!schema.safeParse(data).success) {
    console.log("deu ruim login");

    return schema.safeParse(data);
  }

  const dataParsed = schema.parse(data);

  const token = fetch("https://max-notes-api.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: dataParsed.email,
      password: dataParsed.password,
    }),
  })
    .then((r) => r.json())
    .then((json) => {
      if(json.error) throw new Error("Email ou senha estão incorretos");
      return json.accesstoken
    })
    //.catch(() => {throw new Error("Email or password is incorrect")});
  
  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", await token);
  //console.log(session.data);

  return redirect("/notes/show", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export function ErrorBoundary() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"
  
  return (
    <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">Login</h2>
        <h3 className="login__subtitle2">Bem vindo</h3>

        <Form method="POST">
          <div className="login__input-wrapper">
          <span className="login__error-message">Email ou senha estão incorretos</span>
            <input
              className="login__input-user input "
              placeholder="Email"
              id="user"
              name="email"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("email")) ? <span className="login__error">Insira um email valido</span> : null}
          </div>
          <div className="login__input-wrapper">
          <input
            className="login__input-email input"
            type="password"
            placeholder="Password"
            id="pass"
            name="password"
          />
          {data?.error?.issues.some((item: any) => item.path.includes("password") ) ? <span className="login__error">A senha deve possuir no minimo 6 letras</span> : null}
          </div>
          <button className="login__button">{isSubmitting ? 'Aguarde...' : 'Continue'}</button>
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

export default function Login() {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"


 
  return (
    <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">Login</h2>
        <h3 className="login__subtitle">Bem vindo</h3>

        <Form method="POST">
          <div className="login__input-wrapper">
            <input
              className="login__input-user input "
              placeholder="Email"
              id="user"
              name="email"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("email")) ? <span className="login__error">Insira um email valido</span> : null}
          </div>
          <div className="login__input-wrapper">
          <input
            className="login__input-email input"
            type="password"
            placeholder="Password"
            id="pass"
            name="password"
          />
          {data?.error?.issues.some((item: any) => item.path.includes("password") ) ? <span className="login__error">A senha deve possuir no minimo 6 letras</span> : null}
          </div>
          <button className="login__button">{isSubmitting ? 'Aguarde...' : 'Continue'}</button>
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
