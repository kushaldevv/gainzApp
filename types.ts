import { ReactNode } from "react";

export interface User  {
    id: string;
    name: string;
    pfp: string;
}

export interface UserProfile extends User {
    following: User[];
    followers: User[];
    sessions: Session[];
};

export type Session = {
    id: string;
    name: string;
    user: User;
    location: string;
    date: string;
    exercises: Exercise[];
    duration: number;
    comments: number;
    likes: User[];
    numLikes: number;
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
  userPfp: string;
};

export type Comment = { 
    user : User;
    date: string;
    body: string;
    likes: string[];
};

export type CommentProps = {
    index: number;
    comment: Comment;
    sessionID: string;
    userID: string;
    loading: boolean;
};

export  type FormCardProps = {
    children: ReactNode;
    error : boolean;
};

export type UserScrollViewProps = {
    userList: User[];
    loading: boolean;
}