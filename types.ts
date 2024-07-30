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
    //max 3, use getLikes to get all
    likes: User[];
    numLikes: number;
    userLiked: boolean;
};

export type Exercise = {
    name: string;
    date: string;
    pr: number;
    reps: number[];
    weight: number[];
};


export type CardProps = {
  session: Session;
  loading: boolean;
  userDetails: User | null;
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
    notisContent?: NotiContent[];
    followingScreen?: boolean;
}

//use index as key when mapping
export enum NotiType {
    FOLLOW_REQUEST = 1,
    SESSION_LIKE = 2,
    SESSION_COMMENT = 3,
    SESSION_FEEDBACK = 4,
}

export interface NotiContent  {
    sessionID: string;
    date: string;
    type : NotiType;
}

export interface Noti extends NotiContent {
    user: User;
};