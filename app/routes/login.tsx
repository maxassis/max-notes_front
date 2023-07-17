import styles from "../styles/login.css" ;

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }


export default function Login() {
    return <div className="login">
        <div className="login__wrapper">
            <h2 className="login__title">Login</h2>
            <h3 className="login__subtitle">Bem vindo</h3>

            <input className="login__input-user" type="text" placeholder="Username" />
            <input className="login__input-password" type="password" placeholder="Password" />

            <span className="login__forgot">Esqueceu a senha ?</span>

            <button className="login__button">Continue</button>

            <h4 className="login__forgot">Novo usuário ? <span>Registre-se</span></h4>
        </div>




    </div>
}