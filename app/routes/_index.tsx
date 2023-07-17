import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Max Notes" },
    { name: "description", content: "Welcome to Max Notes!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Max Notes</h1>
    </div>
  );
}
