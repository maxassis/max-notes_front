import type { V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Max Notes" },
    { name: "description", content: "Welcome to Max Notes!" },
  ];
};

export const loader = async () => {
  return redirect("/login")    
};
