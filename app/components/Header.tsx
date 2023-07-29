import styles from "../styles/header.css";
import { Form, useMatches, } from "@remix-run/react";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

export default function Header() {
    const [,notes] = useMatches();
    const {data: {email, name}}  = notes
   // console.log(email, name)
    
    return (
        <div className="header">
            <div className="header__user">
                <div className="header__user-data">
                    <div className="header__icon-wrapper"></div>
                    <div>
                        <h4 className="header__name">{name}</h4>
                        <h4 className="header__email">{email}</h4>
                    </div>
                </div>
            </div>
            <Form method="POST" action="/notes/search">
                <input className="header__input" placeholder="Pesquisar" name="content" />
            </Form>
        </div>
    )
}