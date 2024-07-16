import { ReactNode } from "react";

export type User = {
    id: string;
    name: string;
    pfp: string;
}

export type Session = {
    id: string;
    user: User;
    location: string;
    date: Date;
    exercies: Excerise[];
    sessionTime: number;
    comments: string[];
    likes: string[];
};

export type Excerise = {
    name: string;
    sets: ExceriseSet[];
};

export type ExceriseSet = {
    reps: number;
    weight: number;
}

export type CardProps = {
  session: Session;
};

export type Comment = {
    name: string;
    date: Date;
    pfp: string;
    body: string;
    likes: number;
};

export type CommentProps = {
    comment: Comment;
  };

export  type FormCardProps = {
    children: ReactNode;
    error : boolean;
  };