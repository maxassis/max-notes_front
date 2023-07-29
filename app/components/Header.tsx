import styles from "../styles/header.css";
import { useMatches, } from "@remix-run/react";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

export default function Header() {
    const [,,show] = useMatches();
    const {data: {email, name}}  = show
    //console.log(email, name)
    
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
        </div>
    )
}