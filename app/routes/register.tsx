import styles from "../styles/login.css";
import { useActionData, Form, Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import { getSession, commitSession } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const schema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6).trim(),
    check: z.string().nonempty(),
  });

  export async function action({ request }: ActionArgs) {
    const data = Object.fromEntries(await request.formData());
    //console.log(data);
  
    if (!schema.safeParse(data).success) {
     // console.log("deu ruim");
   
      return schema.safeParse(data);
    }
   
   // console.log("deu bom");
    const token = fetch("https://max-notes-api.onrender.com/auth/register", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if(json.error) throw new Error("Este email ja está cadastrado");
        return json.accesstoken
      })
   
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
   // console.log(data)
    
    return (
      <div className="login">
      <div className="login__wrapper">
        <h2 className="login__title">Registro</h2>
        <h3 className="login__subtitle2">Bem vindo</h3>

        <Form method="POST">
          <div className="login__input-wrapper">
          <span className="login__error-message">Este email ja está cadastrado</span>
            <input
              className="login__input-user input"
              type="text"
              placeholder="Username"
              name="name"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("name")) ? <span className="login__error">Nome e obrigatorio</span> : null}
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-email input"
              placeholder="Email"
              name="email"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("email")) ? <span className="login__error">Insira um email valido</span> : null}
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-password input"
              type="password"
              name="password"
              placeholder="Senha"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("password")) ? <span className="login__error">A senha de possuir no minimo 6 letras</span> : null}
          </div>

          <div className="login__checkbox">
            <input type="checkbox" name="check" value="check" />
            <span>Aceito os termos e condições</span>
            {/* {data?.error?.issues.some((item: any) => item.path.includes("check")) ? <span className="login__terms" >Marque a caixa</span> : null} */}
          </div>
          {data?.error?.issues.some((item: any) => item.path.includes("check")) ? <span className="login__terms" >Aceite os termos</span> : null}

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


export default function Login() {
  const data = useActionData();

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
            {data?.error?.issues.some((item: any) => item.path.includes("name")) ? <span className="login__error">Nome e obrigatorio</span> : null}
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-email input"
              placeholder="Email"
              name="email"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("email")) ? <span className="login__error">Insira um email valido</span> : null}
          </div>

          <div className="login__input-wrapper">
            <input
              className="login__input-password input"
              type="password"
              name="password"
              placeholder="Senha"
            />
            {data?.error?.issues.some((item: any) => item.path.includes("password")) ? <span className="login__error">A senha de possuir no minimo 6 letras</span> : null}
          </div>

          <div className="login__checkbox">
            <input type="checkbox" name="check" value="check" />
            <span>Aceito os termos e condições</span>
            {/* {data?.error?.issues.some((item: any) => item.path.includes("check")) ? <span className="login__terms" >Marque a caixa</span> : null} */}
          </div>
          {data?.error?.issues.some((item: any) => item.path.includes("check")) ? <span className="login__terms" >Aceite os termos</span> : null}

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
