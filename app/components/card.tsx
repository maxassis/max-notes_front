import styles from "../styles/card.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

interface CardProps {
  color: string;
  title: string;
  content: string;
  created: string;
}

function date(dt: string): string {
    let data = new Date(dt);
    let dataFormatada = ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear();
    return dataFormatada
}

export default function Card({ color, content, title, created }: CardProps) {
  return (
    <div
      className="card"
      style={{ "--background": color } as React.CSSProperties}
    >
      <h2 className="card__title">{title}</h2>
      <p className="card__content">{content}</p>
      <span className="card__date">{ date(created) }</span>
    </div>
  );
}
