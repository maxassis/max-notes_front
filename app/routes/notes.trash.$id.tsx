import { useState, useRef } from "react";
import { links as showStyles } from "./notes.show";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useMatches } from "@remix-run/react";
import { getSession } from "~/session.server";
import type { CardContent, CardProps } from "~/types";
import Card from "~/components/Card"

export function links() {
  return [ ...showStyles() ];
}

export async function loader({ request, params }: LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const authorization = session.data.token;
    //console.log(params);
    
  
    if (!session.data.token) {
      return redirect("/login"); 
    }
  
    const res = await fetch(`http://localhost:3333/posts/trash/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: "bearer " + authorization,
      }
    })
    .then((response) => response.json())


    return res;
  }


  export async function action({ request }: ActionArgs) {
    const data = Object.fromEntries(await request.formData());
   // console.log(data);

    const session = await getSession(request.headers.get("Cookie"));
    const authorization = session.data.token;
  
    if(data.intent != "restore") {
     fetch(`http://localhost:3333/posts/clean/${data.intent}`, {
        method: "POST",
        headers: {
          Authorization: "bearer " + authorization,
        }
      }).then((response) => response.json())
     // .then((response) => console.log(response))
    }

    fetch(`http://localhost:3333/posts/restore/${data.id}`, {
        method: "PATCH",
        headers: {
          Authorization: "bearer " + authorization,
        }
      }).then((response) => response.json())
      //.then((r) => console.log(r))

    return null
  }

export default function Search() {
    const modalRef = useRef<HTMLDialogElement>(null)
    const inputEditRef = useRef<HTMLInputElement>(null)
    const colorEditRef = useRef<HTMLInputElement>(null)
    const textAreaEditRef = useRef<HTMLTextAreaElement>(null)
    const [cardData, setCardData] = useState<Omit<CardProps, "created">>({ color: "#fff", content: "", title: "", id: 0, deleted: "false" });
    const data = useLoaderData() as CardContent[]
    const route = useMatches()
    const id = route[1].data.sub;
    
    
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
    modalRef.current?.close()
  }
  }

    return (
      <>
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
         </Form>

         <Form method="PATCH" name="delete">        
         <button className="modal__delete-button" onClick={() => modalRef.current?.close()}>
          <input type="hidden" name="id" value={cardData?.id} />
          <input type="hidden" name="restore" value="delete" />          
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

      <div className="trash">
        <Form method="POST">
          <input type="hidden" name="intent" value={id} />
          <button>Esvaziar Lixeira</button>
        </Form>
      </div>                
      <div className="show-trash" style={{"marginBlockStart": "40px"}} >
        {data?.map((item, index) => {
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
    )
}