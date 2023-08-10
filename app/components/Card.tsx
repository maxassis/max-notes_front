import styles from "../styles/card.css";
import type { OpenModal } from "~/types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

function date(dt: string ): string {
  return new Date(dt).toLocaleDateString('pt-br', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  } ) + "h"
}

export default function Card({ color, content, title, created, openModal, id, deleted }: OpenModal) {
  
  return (
    <div
      onClick={() => openModal({ color, content, title, created, id, deleted })}
      className="card"
      style={{ "background": color }}  
    >
      <h2 className="card__title">{title}</h2>
      <textarea className="card__content" defaultValue={content}></textarea>
      <span className="card__date">{ date(created) }</span>
    </div>
  );
}
