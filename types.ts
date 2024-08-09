import { ReactNode } from "react";

export interface User  {
    id: string;
    name: string;
    pfp: string;
}

export interface UserProfile extends User {
    following: number;
    followers: number;
    recentSessions: { [key: string]: dateDuration[] };
    highestDuration: dateDuration;
    streak: number;
    randomPr: { name: string ; pr: number};
};

export interface dateDuration {
    date: string;
    duration: number;
}

export type Session = {
    id: string;
    name: string;
    user: User;
    location: string;
    date: string;
    exercises: ExerciseViewProp[];
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

export type ExerciseViewProp = {
    name: string;
    set: ExerciseSetViewProp[];
}

export type ExerciseSetViewProp = {
    reps: number;
    weight: number;
}

export type CardProps = {
  session: Session;
  loading: boolean;
  userDetails: User | null;
};

export type InnerCardProps = {
    exercises: Exercise[];
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

export type UserProfileProps = {
    userID: string;
    isPublicProfile: boolean;
  };
  
export type ExercisesContextType = {
    exercises: ExerciseViewProp[];
    setExercises: React.Dispatch<React.SetStateAction<ExerciseViewProp[]>>;
};
