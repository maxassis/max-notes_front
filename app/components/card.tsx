import styles from "../styles/card.css";
import type { CardProps } from "~/types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function date(dt: string ): string {
    let data = new Date(dt);
    let dataFormatada = ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    return dataFormatada
}

export default function Card({ color = "#fff", content, title, created, openModal }: CardProps) {
  
  return (
    <div
      onClick={() => openModal()}
      className="card"
      style={{ "background": color }}  
    >
      <h2 className="card__title">{title}</h2>
      <p className="card__content">{content}</p>
      <span className="card__date">{ date(created) }</span>
    </div>
  );
}
