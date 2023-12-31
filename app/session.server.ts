import { createCookieSessionStorage } from "@remix-run/node";


const { getSession, commitSession, destroySession } =
  createCookieSessionStorage(
    {
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 86400,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession };

