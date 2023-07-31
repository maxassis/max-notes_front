import styles from "../styles/card.css";
import type { OpenModal } from "~/types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function date(dt: string ): string {
    let data = new Date(dt);
    let dataFormatada = ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    return dataFormatada
}

export default function Card({ color, content, title, created, openModal, id, deleted }: OpenModal) {
  
  return (
    <div
      onClick={() => openModal({ color, content, title, created, id, deleted })}
      className="card"
      style={{ "background": color }}  
    >
      <h2 className="card__title">{title}</h2>
      <p className="card__content">{content}</p>
      <span className="card__date">{ date(created) }</span>
    </div>
  );
}
