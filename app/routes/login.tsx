import styles from "../styles/login.css" ;
import { useActionData, Form, Link } from "@remix-run/react";
import { ActionArgs, redirect } from "@remix-run/node";
import { z } from "zod";


export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

const schema = z.object({
  email: z.string().email({message: "fornecer email valido"}),
  password: z.string().min(6, {message: "minimo de 6 caracteres"}),
});


export async function action({request}: ActionArgs) {
    const data = Object.fromEntries(await request.formData())
    console.log(data);
    
    if(!schema.safeParse(data).success) {
        console.log("deu ruim");
        
        return schema.safeParse(data);
      }
    
      if(schema.safeParse(data).success) {
        fetch("http://localhost:3333/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "email": data.email,
            "password": data.password
        })
        }).then(response => response.json())
        .then(json => console.log(json))
        } 
    
    
     return null
    
    }


export default function Login() {
       return (
    <div className="login">
        <div className="login__wrapper">
            <h2 className="login__title">Login</h2>
            <h3 className="login__subtitle">Bem vindo</h3>

            <Form method="POST">
                <input className="login__input-user" placeholder="Email" id="user" name="email" />
                <input className="login__input-email" type="password" placeholder="Password" id="pass" name="password" />

                <button className="login__button">Continue</button>
            </Form>

            <Link to="/register">
                <h4 className="login__forgot">Novo usuário ? <span>Registre-se</span></h4>
            </Link>
        </div>
    </div>
    )
}