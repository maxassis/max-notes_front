import styles from "../styles/show.css";
import Card from "../components/card";
import { useState } from "react";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Show() {
  const [showColor, setShowColor] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#fff");

  
  return (
    <>
      <div className="search">
        <div className="search__box" style={{backgroundColor: selectedColor}}>
          <input
            className="search__input"
            type="text"
            placeholder="Digite um titulo"
          />
          <textarea
            style={{backgroundColor: selectedColor}}
            className="search__textarea"
            placeholder="Crie uma nota..."
          ></textarea>
          <div className="search__options">
            <div className="search__icons-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path fill="#0F0F0F" fill-rule="evenodd" d="M18.172 1a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 23 5.828V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h14.172ZM4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h1v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6h1a1 1 0 0 0 1-1V6.828a2 2 0 0 0-.586-1.414l-1.828-1.828A2 2 0 0 0 17.172 3H17v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V3H4Zm13 18v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3Z" clip-rule="evenodd"/>
              </svg>

              <svg className="search__color-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" onClick={() => setShowColor(!showColor)}>
                <path fill="#ff15a1" stroke="#373737" stroke-width=".5" d="M10.5 10.5c.002 2.762-2.237 5-5 5s-5.002-2.238-5-5c-.002-2.76 2.237-5 5-5s5.002 2.24 5 5z" color="#000"/>
                <path fill="#1583ff" d="M8 1.401a4.998 4.998 0 0 0-2.488 9.334c-.004-.078-.012-.155-.012-.234a4.998 4.998 0 0 1 7.488-4.334A4.994 4.994 0 0 0 8 1.4z"/>
                <path fill="#00cf2d" d="M10.5 5.5a4.998 4.998 0 0 0-5 5c0 .08.008.157.012.235A4.998 4.998 0 0 0 13 6.401c0-.079-.008-.156-.012-.234A4.975 4.975 0 0 0 10.5 5.5z"/>
                <path fill="#f8ff15" d="M12.988 6.167c.004.078.012.155.012.234a4.998 4.998 0 0 1-7.489 4.334 4.994 4.994 0 0 0 4.989 4.766 4.998 4.998 0 0 0 2.488-9.334z"/>
                <path fill="#ef0000" d="M5.512 10.735a4.996 4.996 0 0 0 2.486 4.093 4.987 4.987 0 0 0 2.49-4.091A4.978 4.978 0 0 1 8 11.4a4.975 4.975 0 0 1-2.488-.666z"/>
                <path fill="#383027" d="M7.998 6.173A4.991 4.991 0 0 0 5.5 10.5c0 .079.008.156.012.234a4.978 4.978 0 0 0 4.977.002c.003-.079.011-.157.011-.236a4.99 4.99 0 0 0-2.502-4.328z"/>
                <path fill="#5100cc" d="M5.5 5.5c-.91 0-1.76.247-2.494.67a4.99 4.99 0 0 0 2.506 4.564c-.004-.077-.012-.154-.012-.233a4.991 4.991 0 0 1 2.498-4.328A4.975 4.975 0 0 0 5.5 5.5z"/>
                <path fill="none" stroke="#373737" d="M8 1.401a4.998 4.998 0 0 0-4.994 4.77 4.998 4.998 0 1 0 4.992 8.658 4.998 4.998 0 1 0 4.99-8.662A4.994 4.994 0 0 0 8 1.4z"/>
              </svg>

              <div className={"search__colors-show " + (showColor ? "search--open-colors " : "")}>
                <div className="search__single-color" style={{backgroundColor: '#9CD483'}} onClick={() => setSelectedColor('#9CD483')}></div>
                <div className="search__single-color" style={{backgroundColor: '#FFAF22'}} onClick={() => setSelectedColor('#FFAF22')}></div>
                <div className="search__single-color" style={{backgroundColor: '#A78295'}} onClick={() => setSelectedColor('#A78295')}></div>
                <div className="search__single-color" style={{backgroundColor: '#FC6016'}} onClick={() => setSelectedColor('#FC6016')}></div>
                <div className="search__single-color" style={{backgroundColor: '#9859FF'}} onClick={() => setSelectedColor('#9859FF')}></div>
                <div className="search__single-color" style={{backgroundColor: '#ADADAD'}} onClick={() => setSelectedColor('#ADADAD')}></div>
                <div className="search__single-color" style={{backgroundColor: '#75C2F6'}} onClick={() => setSelectedColor('#75C2F6')}></div>
                <div className="search__single-color" style={{backgroundColor: '#FF52A2'}} onClick={() => setSelectedColor('#FF52A2')}></div>
              </div>
            </div>
            
              <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" fill="none" viewBox="0 0 24 24">
                <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12v5M14 12v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/>
              </svg>
          </div>
        </div>
      </div>

      <div className="show">
        <Card color="red" title="primeiro titulo" content="aqui e o conteudo"/>
        {/* <Card />
        <Card />
        <Card />
        <Card />  
        <Card /> 
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />  
        <Card />    */}
      </div>
    </>
  );
}
