export interface CardContent {
  color: string;
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  deleted: string;
}

export interface CardProps {
  color: string;
  title: string;
  content: string;
  created: string;
  id: number;
  deleted: string;
}

export interface OpenModal extends CardProps {
  openModal: ({
    color,
    content,
    title,
    created,
    id,
    deleted
  }: CardProps) => void;
}
