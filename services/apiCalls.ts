import axios from 'axios';
import * as Types from '@/types';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Appends a comment to a user's session.
 * 
 * @param userID - The unique identifier of the user.
 * @param sessionID - The unique identifier of the session.
 * @param body - The content of the comment.
 * @returns A Promise that resolves when the comment is successfully appended.
 * @throws Will throw an error if the API request fails.
 */
export const appendSessionComment = async(userID: string, sessionID: string, body: string) => {
  const sessionUserID = sessionID.split('session')[0]
  console.log("session user id: ", sessionUserID);
  try {
    // Prepare the payload for the API request
    const payload = {
      "userID": userID,
      "body": body,
      "date": new Date().toISOString(), // Current date and time in ISO format
      "likes": 0 // Initialize likes count to 0
    }

    // Send a PATCH request to update the session with the new comment
    console.log("append session comment....");
    await axios.patch(`${API_URL}/user/sessions/comments?userID=${sessionUserID}&sessionID=${sessionID}`, payload);
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

/**
 * Appends a like to a user's session.
 * 
 * @param userID - The unique identifier of the user.
 * @param sessionID - The unique identifier of the session.
 * @returns A Promise that resolves when the like is successfully appended.
 * @throws Will throw an error if the API request fails.
 */
export const appendSessionLikes = async(userID: string, sessionID: string) => {
  const sessionUserID = sessionID.split('session')[0];
  console.log("session user id: ", sessionUserID);
  console.log("user id", userID);
  console.log(`${API_URL}/user/sessions/likes?userID=${sessionUserID}&sessionID=${sessionID}`);

  try {
    // Send a PATCH request to update the session with a new like
    console.log("append sessions....");
    await axios.patch(`${API_URL}/user/sessions/likes?userID=${sessionUserID}&sessionID=${sessionID}`, {userID});
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

/**
 * Appends a session to a user account
 * 
 * @param userID - The unique identifier of the user.
 * @param session - The session that will be appended to a user
 * @returns A Promise that resolves when the like is successfully appended.
 * @throws Will throw an error if the API request fails.
 */
export const appendSession = async(userID: string, session: any) => {
  try {
    console.log("append session....");
    // Send a PATCH request to update the user with a new session
    await axios.patch(`${API_URL}/user?userID=${userID}`, session);
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

/**
 * Retrieves the users who have liked a specific session.
 * 
 * @param userID - The unique identifier of the user who owns the session.
 * @param sessionID - The unique identifier of the session.
 * @returns A Promise that resolves to an array of User objects who have liked the session.
 * @throws Will throw an error if the API request fails or if there's an issue fetching user data.
 */
export const getSessionLikes = async(userID: string, sessionID: string) => {
  try {
    // Make a GET request to fetch the IDs of users who liked the session
    console.log("get session likes....");
    const response = await axios.get(`${API_URL}/user/sessions/likes?userID=${userID}&sessionID=${sessionID}`);
    
    // Map over the array of user IDs and fetch full user data for each
    const likedUsers: Types.User[] = await Promise.all(
      response.data.map(async (friendID: string) => await getUser(friendID))
    );
    
    // Return the array of User objects
    return likedUsers;
  } catch (error) {
    // If an error occurs during the API request or user data fetching, re-throw it
    throw error;
  }
}

/**
 * Posts a specific user to the DynamoDB database
 * 
 * @param id - The unique identifier of the user
 * @param name - The name of the user
 * @returns A Promise that resolves when a user is posted
 * @throws Will throw an error if the API request fails or if there's an issue fetching user data.
 */
export const postUser = async(id: string, name: string) => {
  try {
    // Prepare the payload for the API request
    const payload = {
      "userID": id,
      "name": name,
      "pfp": `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=00cccc&color=fff`, 
      "friends": [],
      "sessions": {}
    }
    // Send a POST request to update the database with a new user
    console.log("post user....");
    await axios.post(`${API_URL}/user`, payload);
  } catch (error) {
    // If an error occurs during the API request or user data fetching, re-throw it
    throw error;
  }
}

/**
 * Fetches user data for a given user ID.
 * 
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a User object containing id, name, and profile picture URL.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUser = async (id: string) => {
  try {
    // Make a GET request to fetch user data
    console.log("get user....");
    const response = await axios.get(`${API_URL}/user?userID=${id}`);
    
    // Extract the data from the response
    const data = response.data;
    
    // Construct a User object from the API response
    const user: Types.User = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string, // pfp likely stands for "profile picture"
    };
    
    // Return the constructed User object
    return user;
  } catch (error) { 
    // Re-throw the error for the caller to handle
    throw error;
  }
}

/**
 * Fetches user data for a given user ID.
 * 
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a User profile object.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUserProfile = async (id: string) => {
  try {
    // Make a GET request to fetch user profile data
    console.log("get user profile....");
    const response = await axios.get(`${API_URL}/user?userID=${id}`);
    const data = response.data;

    // maps thru the friends list of user ids(strings), and calls getUser on each
    // end result is a friends list of type User
    const friendPromises = data.friends.map((friendId : string) => getUser(friendId));
    const friends: Types.User[] = await Promise.all(friendPromises);

    // Construct a User profile object from the API response
    const userProfile: Types.UserProfile = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string,
      friends: friends,
      sessions: [],
    }
    // Return the constructed User profile object
    return userProfile;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

/**
 * Fetches the sessions for a user
 *
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a Session.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUserSessions = async (id: string) => {
  try {
    // Make a GET request to fetch a session for a user
    console.log("get a user session....");
    const response = await axios.get(`${API_URL}/user/sessions?userID=${id}`);
    const data = response.data;

    // This function maps thru every session and session-likes in data,
    // creates a session type, and returns a list of sessions
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
    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Fetches the friends for a user
 *
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a list of friends.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUserFriends = async (id: string) => {
  try {
    console.log("get a user friends....");
    // Make a GET request to fetch the friends for a user
    const response = await axios.get(`${API_URL}/user/friends?userID=${id}`);
    const friends = await Promise.all(response.data.map(async (friendID: string) => await getUser(friendID)));
    return friends;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

/**
 * Fetches the comments for a sesison
 *
 * @param userId - The unique identifier of the user to fetch.
 * @param sessionId - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a list of comments.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getSessionComments = async (userId: string, sessionId: string) => {
  try {
    console.log("get session comments....");
    // Make a GET request to fetch the comments for a user's session
    const response = await axios.get(`${API_URL}/user/sessions/comments?userID=${userId}&sessionID=${sessionId}`);
    const responseData = response.data;

    // This function maps thru every comment, generates a user,
    // and returns a list of comments
    const comments: Types.Comment[] = await Promise.all(
      responseData.flatMap((comment: any) =>
        Object.entries(comment).map(async ([commentID, content]: [string, any]) => {
          const user = await getUser(content.userID) as Types.User;
          return {
            id: commentID as string,
            user,
            date: content.date as string,
            body: content.body as string,
            likes: content.likes as number
          };
        })
      )
    );
    return comments;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}
