import type { V2_MetaFunction , LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/session.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Max Notes" },
    { name: "description", content: "Welcome to Max Notes!" },
  ];
};


export async function loader({request}: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"))

  if(!session.data.token) {
      return redirect("/login")
  }

  return redirect("notes/show")
}