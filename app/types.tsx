export interface CardContent {
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
  id: number;
}

export interface OpenModal extends CardProps {
  openModal: ({
    color,
    content,
    title,
    created,
    id
  }: CardProps) => void;
}
