import axios from 'axios';
import * as Types from '@/types';
const API_URL = 'https://ke3qj4rbgb.execute-api.us-east-1.amazonaws.com/production';
export const getUserSessions1 = async (id: string) => {
  const sessionsList: Types.Session[] = []
  try {
    const response = await axios.get(`${API_URL}/user/sessions?userID=${id}`);
    const data: { [sessionId: string]: Types.Session } = response.data;
    const user = await getUser(id) as Types.User;

    Object.entries(data).forEach(([sessionId, session]: [string, Types.Session]) => {
      const userSession: Types.Session = {
        id: sessionId,
        user: user,
        location: session.location,
        date: session.date,
        exercises: session.exercises,
        duration: session.duration,
        comments: session.comments,
        likes: session.likes
      }
      sessionsList.push(userSession);
    });
    return sessionsList
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getUserSessions = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions?userID=${id}`);
    const data = response.data;

    const sessions = await Promise.all(
      Object.entries(data).map(async ([sessionID, sessionData]: [string, any]) => {
        const likes: Types.User[] = await Promise.all(
          sessionData.likes.map((like: string) => getUser(like))
        );
        const comments: Types.Comment[] = await Promise.all(
          sessionData.comments.flatMap((comment: any) =>
            Object.entries(comment).map(async ([userID, content]: [string, any]) => {
              const user = await getUser(userID) as Types.User;
              return {
                user,
                date: content.date as string,
                body: content.body as string,
                likes: content.likes as number
              };
            })
          )
        );
        const session: Types.Session = {
          id: sessionID,
          user: await getUser(id) as Types.User,
          location: sessionData.location as string,
          date: sessionData.date as string,
          exercises: [], 
          duration: sessionData.duration as number,
          comments: comments,
          likes: likes
        };
        return session;
      })
    );
    return sessions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/user?userID=${id}`);
    const data = response.data;

    const user: Types.User = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string,
    };
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUserProfile = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/user?userID=${id}`);
    const data = response.data;

    const friendPromises = data.friends.map((friendId : string) => getUser(friendId));
    const friends: Types.User[] = await Promise.all(friendPromises);

    const userProfile: Types.UserProfile = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string,
      friends: friends,
      sessions: [],
    }
    console.log("user profile friends: ", userProfile);
    return userProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getSessionComments = async (userId: string, sessionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions/comments?userID=${userId}&sessionID=${sessionId}`);
    const responseData = response.data;

    const comments: Types.Comment[] = await Promise.all(
      responseData.flatMap((comment: any) =>
        Object.entries(comment).map(async ([userID, content]: [string, any]) => {
          const user = await getUser(userID) as Types.User;
          return {
            user,
            date: content.date as string,
            body: content.body as string,
            likes: content.likes as number
          };
        })
      )
    );
    console.log("comments: ", comments);
    return comments;
  } catch (error) {
    throw error;
  }
}