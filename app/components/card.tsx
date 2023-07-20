import styles from "../styles/card.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }


interface CardProps {
    color: string;
    title: string;
    content: string;
}

export default function Card({ color, content, title }: CardProps) {
    return (
        <div className="card" style={{ "--background": color } as React.CSSProperties} >
            <h2 className="card__title">{title}</h2>
            <p className="card__content">{content}</p>
            <span className="card__date">12.07.2023</span>
        </div>

    )
}