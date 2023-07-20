import { redirect, type LoaderArgs } from "@remix-run/node";
import { destroySession, getSession } from "~/session.server";


export async function loader({ request }: LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))

    return redirect("/login", {
        headers: {
        "Set-Cookie": await destroySession(session)
        }
    })
}