import styles from "../styles/show.css";
import Card, { links as cardStyle } from "../components/Card";
import { useState, useRef, useEffect } from "react";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
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

  const res = await fetch("http://localhost:3333/posts", {
    headers: { Authorization: "bearer " + authorization },
  })
  .then((response) => response.json())

  return res;
}

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData());

  if (data.intent !== "delete" && !schema.safeParse(data).success) {
    console.log("deu ruim show");
    return schema.safeParse(data);
  }

  const session = await getSession(request.headers.get("Cookie"));
  const authorization = session.data.token;

  if(data.intent === "delete") {
    fetch("http://localhost:3333/posts/trash/" + data.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + authorization,
    },
  }).then((response) => response.json())
  .then(() => redirect("/notes/show"))
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
    .then(() => redirect("/notes/show"))
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
      deleted: data.deleted === "true" ? true : false,
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
  const [selectedColor, setSelectedColor] = useState<string>("#fff");
  const [blur, setBlur] = useState<string>("")

  const [cardData, setCardData] = useState<Omit<CardProps, "created">>({ color: "#fff", content: "", title: "", id: 0, deleted: "false" });
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
    // setShowModalColor(false)
    modalRef.current?.close()
  }
  }

  useEffect(() => {
    if(navigation.state === "loading" && navigation.formMethod === "POST" && navigation.formAction === "/notes/show") {
      // alert("teste")
     // console.log(navigation);
      clearInputs()

    }
  },[navigation])



  function clearInputs(): void {
  //  console.log(inputCreateRef.current!.value);
    inputCreateRef.current!.value = ""
    textAreaCreateRef.current!.value = ""
    setSelectedColor("#fff")
    setShowColor(false)
    setBlur("")
  }


  return (
    <>
      <div className="search">
        <div className="search__box"  style={{ backgroundColor: selectedColor, borderColor: (selectedColor === "#fff" ? "#d6d6d6" : selectedColor)}}>
          <Form method="POST" name="create">
            <input
              className="search__input"
              type="text"
              placeholder="Digite um titulo"
              name="title"
              ref={inputCreateRef}
            />
            <textarea
              style={{ backgroundColor: selectedColor }}
              className="search__textarea"
              placeholder="Crie uma nota..."
              name="content"
              ref={textAreaCreateRef}
              onChange={(e) => setBlur(e.target.value)}
            ></textarea>
            <input type="hidden" name="color" value={selectedColor} />
            <input type="hidden" name="deleted" value={cardData?.deleted} />
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

                <button type="button" className="search__color-button"> 
                  <img src={Color} onClick={() => setShowColor(!showColor)} alt="colors" className="search__color-icon" />
                </button>   

                <div className="search__colors-show ">
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
                    style={{ backgroundColor: "#FFAE6D" }}
                    onClick={() => setSelectedColor("#FFAE6D")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#E8FFCE" }}
                    onClick={() => setSelectedColor("#E8FFCE")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FEFF86" }}
                    onClick={() => setSelectedColor("#FEFF86")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#EA8FEA" }}
                    onClick={() => setSelectedColor("#EA8FEA")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FAF8F1" }}
                    onClick={() => setSelectedColor("#FAF8F1")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#E3F6FF" }}
                    onClick={() => setSelectedColor("#E3F6FF")}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FFAACF" }}
                    onClick={() => setSelectedColor("#FFAACF")}
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

                <button type="button" className="modal__color-button"> 
                  <img src={Color} alt="colors" className="search__color-icon" />
                </button>

                <div className="modal__colors-show ">
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
                    style={{ backgroundColor: "#FFAE6D" }}
                    onClick={() => setCardData({...cardData,  color: "#FFAE6D" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#E8FFCE" }}
                    onClick={() => setCardData({...cardData,  color: "#E8FFCE" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FEFF86" }}
                    onClick={() => setCardData({...cardData,  color: "#FEFF86" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#EA8FEA" }}
                    onClick={() => setCardData({...cardData,  color: "#EA8FEA" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FAF8F1" }}
                    onClick={() => setCardData({...cardData,  color: "#FAF8F1" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#E3F6FF" }}
                    onClick={() => setCardData({...cardData,  color: "#E3F6FF" })}
                  ></div>
                  <div
                    className="search__single-color"
                    style={{ backgroundColor: "#FFAACF" }}
                    onClick={() => setCardData({...cardData,  color: "#FFAACF" })}
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

      <div className={"show " + (blur !== "" ? "show--blur" : "")}>
        {data.map((item, index) => {
          return (
              <Card
                id={item.id}
                openModal={openModal}
                color={item.color}
                content={item.content}
                title={item.title}
                created={item.createdAt}
                key={index}
                deleted={item.deleted}
              />
          );
        })}
      </div>
    </>
  );
}
