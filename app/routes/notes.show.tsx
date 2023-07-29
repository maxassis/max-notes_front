import styles from "../styles/show.css";
import Card, { links as cardStyle } from "../components/Card";
import { useState, useRef, useEffect } from "react";
import { Form, useActionData, useLoaderData, useMatches, useNavigation } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { getSession } from "~/session.server";
import type { CardContent, CardProps } from "~/types";
import { z } from "zod";
import Color from "../images/colors.svg"

export function links() {
  return [{ rel: "stylesheet", href: styles }, ...cardStyle()];
}

const schema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  color: z.string().optional(),
});

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token;

  if (!session.data.token) {
    return redirect("/login");
  }

  const res = await fetch("http://localhost:3333/posts", {
    headers: { Authorization: "bearer " + authorization },
  });

  return res.json();
}

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());
  console.log(data);

  if (data.intent !== "delete" && !schema.safeParse(data).success) {
    console.log("deu ruim show");
    return schema.safeParse(data);
  }

  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token;

  if(data.intent === "delete") {
    fetch("http://localhost:3333/posts/" + data.id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + authorization,
    },
  }).then((response) => response.json())
  }
  
  if(data.intent !== "delete" && data.id) {
    fetch("http://localhost:3333/posts/" + data.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + authorization,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        color: data.color,
      }),
    }).then((response) => response.json())
  }
  
  if(data.intent !== "delete" && !data.id) {
  fetch("http://localhost:3333/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + authorization,
    },
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      color: data.color,
    }),
  }).then((response) => response.json())
  .then(() => redirect("/notes/show"))
  }

  return null
};
 
export default function Show() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const inputCreateRef = useRef<HTMLInputElement>(null)
  const inputEditRef = useRef<HTMLInputElement>(null)
  const textAreaEditRef = useRef<HTMLTextAreaElement>(null)
  const colorEditRef = useRef<HTMLInputElement>(null)
  const textAreaCreateRef = useRef<HTMLTextAreaElement>(null)
  const [showColor, setShowColor] = useState<boolean>(false);
  const [showModalColor, setShowModalColor] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#fff");
  const [cardData, setCardData] = useState<Omit<CardProps, "created">>({ color: "#fff", content: "", title: "", id: 0 });
  const req = useActionData();
  const data = useLoaderData() as CardContent[]
  const navigation = useNavigation();
  

  function openModal(dt: CardProps) {
    setCardData(dt)
    inputEditRef.current!.value = dt.title
    textAreaEditRef.current!.value = dt.content
    colorEditRef.current!.value = dt.color
    modalRef.current?.showModal()
  }

  function closeModal(e: React.MouseEvent<HTMLDialogElement>) {
    const dialogDimensions = modalRef.current?.getBoundingClientRect() as DOMRect
    if (
      e.clientX < dialogDimensions?.left ||
      e.clientX > dialogDimensions?.right ||
      e.clientY < dialogDimensions?.top ||
      e.clientY > dialogDimensions?.bottom
  ) {
    setShowModalColor(false)
    modalRef.current?.close()
  }
  }

  useEffect(() => {
    if(navigation.state === "loading" && navigation.formMethod === "POST" && navigation.formAction === "/notes/show") {
      // alert("teste")
      console.log(navigation);
      clearInputs()

    }
  },[navigation])



  function clearInputs(): void {
  //  console.log(inputCreateRef.current!.value);
    inputCreateRef.current!.value = ""
    textAreaCreateRef.current!.value = ""
    setSelectedColor("#fff")
    setShowColor(false)
  }

  return (
    <>
      <div className="search">
        <div className="search__box" style={{ backgroundColor: selectedColor, borderColor: (selectedColor === "#fff" ? "#d6d6d6" : selectedColor)}}>
          <Form method="POST" name="create">
            <input
              className="search__input"
              type="text"
              placeholder="Digite um titulo"
              name="title"
              // onChange={(e) => setTitle(e.target.value)} 
              // value={title}
              ref={inputCreateRef}
            />
            {req?.error?.issues.some((item: any) =>
              item.path.includes("title")
            ) ? (
              <span className="search__error">Titulo obrigatório</span>
            ) : null}
            <textarea
              style={{ backgroundColor: selectedColor }}
              className="search__textarea"
              placeholder="Crie uma nota..."
              name="content"
              
              // onChange={(e) => setContent(e.target.value)} 
              // value={content}
              ref={textAreaCreateRef}
            ></textarea>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="search__options">
              <div className="search__icons-wrapper">
                <button className="search__save-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#0F0F0F"
                      fillRule="evenodd"
                      d="M18.172 1a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 23 5.828V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h14.172ZM4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h1v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6h1a1 1 0 0 0 1-1V6.828a2 2 0 0 0-.586-1.414l-1.828-1.828A2 2 0 0 0 17.172 3H17v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V3H4Zm13 18v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <img src={Color} onClick={() => setShowColor(!showColor)} alt="colors" className="search__color-icon" />
                
                <div
                  className={
                    "search__colors-show " +
                    (showColor && "search--open-colors")
                  }
                >
                  <div
                    className="search__single-color"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #d6d6d6",
                    }}
                    onClick={() => setSelectedColor("#fff")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FFAF22" }}
                    onClick={() => setSelectedColor("#FFAF22")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#9CD483" }}
                    onClick={() => setSelectedColor("#9CD483")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FC6016" }}
                    onClick={() => setSelectedColor("#FC6016")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#9859FF" }}
                    onClick={() => setSelectedColor("#9859FF")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#ADADAD" }}
                    onClick={() => setSelectedColor("#ADADAD")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#75C2F6" }}
                    onClick={() => setSelectedColor("#75C2F6")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FF52A2" }}
                    onClick={() => setSelectedColor("#FF52A2")}
                  ></div>
                </div>
              </div>

              <svg
                onClick={() => clearInputs()}
                xmlns="http://www.w3.org/2000/svg"
                width="17.5"
                height="17.5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 12v5M14 12v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
                />
              </svg>
            </div>
          </Form>
        </div>
      </div>

        <dialog className="modal__dialog" ref={modalRef} style={{ backgroundColor: cardData?.color }} onClick={(e) => closeModal(e)} >
         <Form method="PATCH" name="edit" className="modal__form">
        
              <input
              className="modal__input"
              type="text"
              placeholder="Digite um titulo"
              name="title"
              ref={inputEditRef}
            />
            {req?.error?.issues.some((item: any) =>
              item.path.includes("title")
            ) ? (
              <span className="search__error">Titulo obrigatório</span>
            ) : null}
            <textarea
              style={{ backgroundColor: cardData?.color }}
              className="modal__textarea"
              placeholder="Crie uma nota..."
              name="content"
              ref={textAreaEditRef}
            ></textarea>
              <input type="hidden" name="color" ref={colorEditRef} value={cardData?.color} />
              <input type="hidden" name="id" value={cardData?.id} />
             
              <div className="search__options">
              <div className="search__icons-wrapper">
                <button className="search__save-button" onClick={() => modalRef.current?.close()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#0F0F0F"
                      fillRule="evenodd"
                      d="M18.172 1a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 23 5.828V20a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h14.172ZM4 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h1v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6h1a1 1 0 0 0 1-1V6.828a2 2 0 0 0-.586-1.414l-1.828-1.828A2 2 0 0 0 17.172 3H17v2a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V3H4Zm13 18v-6a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <img src={Color} onClick={() => setShowModalColor(!showModalColor)} alt="colors" className="search__color-icon" />
                
                <div
                  className={
                    "modal__colors-show " +
                    (showModalColor && "modal--open-colors")
                  }
                >
                  <div
                    className="search__single-color"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #d6d6d6",
                    }}
                    onClick={() => setCardData({...cardData,  color: "#fff" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FFAF22" }}
                    onClick={() => setCardData({...cardData,  color: "#FFAF22" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#9CD483" }}
                    onClick={() => setCardData({...cardData,  color: "#9CD483" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FC6016" }}
                    onClick={() => setCardData({...cardData,  color: "#FC6016" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#9859FF" }}
                    onClick={() => setCardData({...cardData,  color: "#9859FF" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#ADADAD" }}
                    onClick={() => setCardData({...cardData,  color: "#ADADAD" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#75C2F6" }}
                    onClick={() => setCardData({...cardData,  color: "#75C2F6" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FF52A2" }}
                    onClick={() => setCardData({...cardData,  color: "#FF52A2" })}
                  ></div>
                </div>
              </div>

            </div>   
         </Form>

         <Form method="DELETE" name="delete">        
         <button className="modal__delete-button" onClick={() => modalRef.current?.close()}>
          <input type="hidden" name="id" value={cardData?.id} />
          <input type="hidden" name="intent" value="delete" />          
            <svg                
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="17.5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 12v5M14 12v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
              />
            </svg>
        </button> 
        </Form>              
        
      </dialog>

      <div className="show" >
        {data.map((item: CardContent, index: string) => {
          return (
              <Card
                id={item.id}
                openModal={openModal}
                color={item.color}
                content={item.content}
                title={item.title}
                created={item.createdAt}
                key={index}
              />
          );
        })}
      </div>
    </>
  );
}
