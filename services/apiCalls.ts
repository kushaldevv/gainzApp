import axios from 'axios';
import * as Types from '@/types';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getSessionLikes = async(userID: string, sessionID: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions/likes?userID=${userID}&sessionID=${sessionID}`);
    const likedUsers : Types.User[] = await Promise.all(response.data.map(async (friendID: string) => await getUser(friendID)));
    return likedUsers
  } catch (error) {
    throw error;
  }
}

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
    return userProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getUserSessions = async (id: string) => {
  try {
    console.log("getting sessions")
    const response = await axios.get(`${API_URL}/user/sessions?userID=${id}`);
    const data = response.data;

    const sessions = await Promise.all(
      Object.entries(data).map(async ([sessionID, sessionData]: [string, any]) => {
        const likes: Types.User[] = await Promise.all(
          sessionData.likes.map((like: string) => getUser(like))
        );

        const session: Types.Session = {
          id: sessionID,
          name: sessionData.name as string,
          user: await getUser(id) as Types.User,
          location: sessionData.location as string,
          date: sessionData.date as string,
          exercises: [], 
          duration: sessionData.duration as number,
          comments: sessionData.comments.length,
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

export const getUserFriends = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/friends?userID=${id}`);
    const friends = await Promise.all(response.data.map(async (friendID: string) => await getUser(friendID)));
    return friends
  } catch (error) {
    throw error;
  }
}

export const getSessionComments = async (userId: string, sessionId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions/comments?userID=${userId}&sessionID=${sessionId}`);
    const responseData = response.data;
    const comments: Types.Comment[] = await Promise.all(
      responseData.flatMap(async (comment: any) => {
          const user = await getUser(comment.userID) as Types.User;
          return {
            user,
            date: comment.date as string,
            body: comment.body as string,
            likes: comment.likes as number
          };
        }
      )
    );
    return comments;
  } catch (error) {
    throw error;
  }
}

export const postUser = async(id: string, name: string) => {
  try {
    console.log("posting user")
    const payload = {
      "userID": id,
      "name": name,
      "pfp": "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
      "friends": [],
      "session": {}
    }
    await axios.post(`${API_URL}/user`, payload);
  } catch (error) {
    throw error;
  }
}
export const getSessionLikes = async(userID: string, sessionID: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions/likes?userID=${userID}&sessionID=${sessionID}`);
    const likedUsers : Types.User[] = await Promise.all(response.data.map(async (friendID: string) => await getUser(friendID)));
    return likedUsers
  } catch (error) {
    throw error;
  }
}