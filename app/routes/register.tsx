import styles from "../styles/login.css";
import { Link } from "@remix-run/react"

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }



export default function Login() {
       return (
    <div className="login">
        <div className="login__wrapper">
            <h2 className="login__title">Registro</h2>
            <h3 className="login__subtitle">Bem vindo</h3>

            <input className="login__input-user" type="text" placeholder="Username" />
            <input className="login__input-email" type="email" placeholder="Email" />
            <input className="login__input-password" type="password" placeholder="Senha" />
            <input className="login__input-password" type="password" placeholder="Confirmar Senha" />

            <div className="login__checkbox">
                <input type="checkbox" />
                <span>Aceito os termos e condições</span>
            </div>

            <button className="login__button" style={{marginTop: "1.84rem"}}>Continue</button>

            <Link to="/login">  
                <h4 className="login__forgot">Já tem uma conta ? <span>Login</span></h4>
            </Link>  
        </div>
    </div>
    )
}