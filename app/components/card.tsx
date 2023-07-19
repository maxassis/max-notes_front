import styles from "../styles/card.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
  }

export default function Card() {
    return (
        <div className="card">
            <h2 className="card__title">teste</h2>
            <p className="card__content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum mollitia, iure inventore quos quia maxime. Ipsam fugiat saepe quia aliquam recusandae maiores, minus facere voluptas sequi? Aliquid quibusdam deserunt rerum.</p>
            <span className="card__date">12.07.2023</span>
        </div>

    )
}