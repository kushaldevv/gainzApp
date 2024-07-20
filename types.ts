import { ReactNode } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface User  {
    id: string;
    name: string;
    pfp: string;
}

export interface UserProfile extends User {
    friends : User[];
    sessions: Session[];
};

export type Session = {
    id: string;
    user: User;
    location: string;
    date: string;
    exercises: Exercise[];
    duration: number;
    comments: number;
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
  loading: boolean;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
};

export type Comment = {
    user : User;
    date: string;
    body: string;
    likes: number;
};

export type CommentProps = {
    comment: Comment;
    loading: boolean;
};

export  type FormCardProps = {
    children: ReactNode;
    error : boolean;
};