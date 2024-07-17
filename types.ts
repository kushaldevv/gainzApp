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
    exercises: Exercise[];
    sessionTime: number;
    comments: Comment[];
    likes: User[];
};

export type Exercise = {
    name: string;
    sets: ExerciseSet[];
};

export type ExerciseSet = {
    reps: number;
    weight: number;
}

export type CardProps = {
  session: Session;
};

export type Comment = {
    user: User;
    date: Date;
    pfp: string;
    likes: number;
};

export type CommentProps = {
    comment: Comment;
  };

export  type FormCardProps = {
    children: ReactNode;
    error : boolean;
  };