export interface Card {
    color: string;
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
  }


  export interface CardProps {
    color: string;
    title: string;
    content: string;
    created: string;
    openModal: () => void;
  }