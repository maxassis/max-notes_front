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

        <div className="restore-wrapper">
         <Form method="PATCH" name="delete">  
         <input type="hidden" name="id" value={cardData?.id} />
          <input type="hidden" name="restore" value="delete" />         
         <button className="modal__restore-button" onClick={() => modalRef.current?.close()}>  
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path fill="none" d="M0 0h24v24H0V0z"/>
            <path d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/>
        </svg>    
        </button> 
        </Form> 
        </div>             
        
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