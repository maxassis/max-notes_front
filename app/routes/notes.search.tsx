import { redirect, type ActionArgs } from "@remix-run/node";
import { z } from 'zod'
import { getSession } from "~/session.server";


const schema = z.object({
    content: z.string().nonempty().trim()
  })
  
//   const schema2 = z
//   .object({
//     foo: z.string(),
//     bar: z.array(z.string()),
//     baz: z.object({
//       qux: z.string(),
//     }),
//   })
//   .transform(({ foo, baz: { qux: bazqux } }) => ({
//     foo,
//     bazqux,
//   }));









export async function action({ request }: ActionArgs) {
    const data = Object.fromEntries(await request.formData());
    console.log(data);

    if (!schema.safeParse(data).success) {
      console.log("deu ruim");
  
      return schema.safeParse(data);
    }

    const session = await getSession(request.headers.get("Cookie"));
    const authorization = session.data.token;
    
  
    fetch("http://localhost:3333/posts/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + authorization,
      },
      body: JSON.stringify({
        content: data.content
      }),
    })
      .then((r) => r.json())
      .then((json) => console.log(json))
      //.catch(() => {throw new Error("Email or password is incorrect")});

    return redirect("/notes/search")
  }



export default function Teste() {
    return <h1>hehehehhe</h1>
}