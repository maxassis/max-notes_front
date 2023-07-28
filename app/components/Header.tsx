import styles from "../styles/header.css";
import { useMatches, } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

  export async function loader({ request }: LoaderArgs) {
    console.log("teste");
    
    // const session = await getSession(request.headers.get("Cookie"));
    // const authorization = session.data.token;
    // console.log(authorization);

    // const decode = (token: string): string =>
    // decodeURIComponent(
    //     atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
    //         .split('')
    //         .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
    //         .join('')
    // );
  
    // const tokenData = decode(authorization);
    // console.log(tokenData);
    
  
    // // const res = await fetch("http://localhost:3333/posts", {
    // //   headers: { Authorization: "bearer " + authorization },
    // // });
  
    return null;
  }



export default function Header() {
    const [,,show] = useMatches();
    const {data: {email, name}}  = show
    console.log(email, name)
    
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