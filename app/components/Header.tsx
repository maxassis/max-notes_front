import styles from "../styles/header.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

export default function Header() {
    return (
        <div className="header">
            <div className="header__user">
                <div className="header__user-data">
                    <div className="header__icon-wrapper"></div>
                    <div>
                        <h4 className="header__name">{process.env.NODE_ENV}</h4>
                        <h4 className="header__email">max@teste.com</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}