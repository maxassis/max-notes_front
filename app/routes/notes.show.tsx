import styles from "../styles/show.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Show() {
  return (
    <>
      <div className="search">
        <div className="search__box">
          <input
            className="search__input"
            type="text"
            placeholder="Digite um titulo"
          />
          <textarea className="search__textarea" placeholder="Crie uma nota..."></textarea>
          <div className="search__options">
            <span>salvar</span> <span>limpar</span>
          </div>
        </div>
      </div>
    </>
  );
}
