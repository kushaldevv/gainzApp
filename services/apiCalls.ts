import axios from 'axios';
import * as Types from '@/types';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Append a like to a user's comment
 * 
 * @param userID - The unique identifier of the user.
 * @param sessionID - The unique identifier of the session.
 * @param index - The comment index.
 * @returns A Promise that resolves when a like is appended to a comment likes field
 * @throws Will throw an error if the API request fails.
 */
export const appendLikeToComment = async(userID: string, sessionID: string, index: number) => {
  try {
    console.log('appending like to comment')
    console.log('index', index)
    console.log('sessionID', sessionID)
    console.log('userID', userID)
    const sessionUserID = sessionID.split('session')[0]
    // Send a PATCH request to update the like of a comment
    await axios.patch(`${API_URL}/user/sessions/comments/likes?userID=${sessionUserID}&sessionID=${sessionID}&index=${index}`, {userID});
  } catch (error) {
    // If an error occurs during the API request, re-throw it
      throw error;
  }
}

/**
 * Get's a user's pfp
 * 
 * @param userID - The unique identifier of the user.
 * @returns A Promise that resolves when the user pfp is retrieved
 * @throws Will throw an error if the API request fails.
 */
export const getUserPfp = async(userID: string) => {
  try {
    // Send a GET request to get a user's pfp
    const response = await axios.get(`${API_URL}/user/pfp?userID=${userID}`);
    return response.data;
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

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
  try {
    // Prepare the payload for the API request
    const payload = {
      "userID": userID,
      "body": body,
      "date": new Date().toISOString(), // Current date and time in ISO format
      "likes": [] 
    }

    // Send a PATCH request to update the session with the new comment
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
  try {
    // Send a PATCH request to update the session with a new like
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
export const getSessionLikes = async(sessionID: string) => {
  try {
    const sessionUserID = sessionID.split('session')[0];
    // Make a GET request to fetch the IDs of users who liked the session
    const response = await axios.get(`${API_URL}/user/sessions/likes?userID=${sessionUserID}&sessionID=${sessionID}`);
    
    // Map over the array of user IDs and fetch full user data for each
    const likedUsers: Types.User[] = await Promise.all(
      response.data.map(async (userID: string) => await getUser(userID))
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
export const postUser = async(userID: string, name: string) => {
  try {
    // Prepare the payload for the API request
    const payload = {
      "userID": userID,
      "name": name,
      "pfp": `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=00cccc&color=fff`, 
      "following": [userID],
      "followers": [],
      "sessions": {}
    }
    // Send a POST request to update the database with a new user
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
export const getUser = async (userID: string) => {
  try {
    // Make a GET request to fetch user data
    const response = await axios.get(`${API_URL}/user?userID=${userID}`);
    
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
export const getUserProfile = async (userID: string) => {
  try {
    // Make a GET request to fetch user profile data
    const response = await axios.get(`${API_URL}/user?userID=${userID}`);
    const data = response.data;

    // maps thru the friends list of user ids(strings), and calls getUser on each
    // end result is a friends list of type User
    const followersPromises = data.followers.map((friendId : string) => getUser(friendId));
    const followers: Types.User[] = await Promise.all(followersPromises);

    const followingPromises = data.following.map((friendId : string) => getUser(friendId));
    const following: Types.User[] = await Promise.all(followingPromises);

    // Construct a User profile object from the API response
    const userProfile: Types.UserProfile = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string,
      followers: followers,
      following: following,
      sessions: [],
    }
    // Return the constructed User profile object
    return userProfile;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

export const getFollowingSessions = async (userID: string) => {
  try {
    const following = await getUserFollowing(userID) as Types.User[];
    const followingSessions = await Promise.all(following.map(async (friend) => getUserSessions(friend.id)));
    const flattenedSessions = followingSessions.flat() as Types.Session[];

    // Sort sessions by date
    const sortedSessions = flattenedSessions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })

    return sortedSessions;
  } catch (error) {
    console.error(error);
  }
}

export const getUserSessions = async (userID: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions?userID=${userID}`);
    const data = response.data;
    const sessions = await Promise.all(

      Object.entries(data).map(async ([sessionID, sessionData]: [string, any]) => {
        const likes: Types.User[] = await Promise.all(
          sessionData.likes.slice(0,3).map((like: string) => getUser(like))
        );
        const session: Types.Session = {
          id: sessionID,
          name: sessionData.name as string,
          user: await getUser(userID) as Types.User,
          location: sessionData.location as string,
          date: sessionData.date as string,
          exercises: [], 
          duration: sessionData.duration as number,
          comments: sessionData.comments.length,
          likes: likes,
          numLikes: sessionData.likes.length as number,
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
 * Fetches the following for a user
 *
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a list of following.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUserFollowing = async (userID: string) => {
  try {
    // Make a GET request to fetch the following for a user
    const response = await axios.get(`${API_URL}/user/following?userID=${userID}`);
    const following = await Promise.all(response.data.map(async (followingID: string) => await getUser(followingID)));
    return following;
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
export const getSessionComments = async (userID: string, sessionID: string) => {
  try {
    // Make a GET request to fetch the comments for a user's session
    const response = await axios.get(`${API_URL}/user/sessions/comments?userID=${userID}&sessionID=${sessionID}`);
    const responseData = response.data;

    // This function maps thru every comment, generates a user,
    // and returns a list of comments
    const comments: Types.Comment[] = await Promise.all(
      responseData.flatMap(async (comment: any) => {
          const user = await getUser(comment.userID) as Types.User;
          return {
            user,
            date: comment.date as string,
            body: comment.body as string,
            likes: comment.likes as string[]
          };
        }
      )
    );
    return comments;
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}
// export const getSpecificUserSession = async (sessionID: string) => {
//   try {
//     console.log("getting a specific session");
//     const sessionUserID = sessionID.split('session')[0]
//     const response = await axios.get(`${API_URL}/user/session?userID=${sessionUserID}&sessionID=${sessionID}`);
//     const respData = response.data;

//     const likes: Types.User[] = await Promise.all(
//       respData.likes.map((like: string) => getUser(like))
//     );
    
//     const session: Types.Session = {
//       id: sessionID,
//       name: respData.name as string,
//       user: await getUser(sessionUserID) as Types.User,
//       location: respData.location as string,
//       date: respData.date as string,
//       exercises: [], 
//       duration: respData.duration as number,
//       comments: respData.comments.length,
//       likes: likes,
//     };
//     return session;
//   } catch (error) {
//     // Re-throw the error for the caller to handle
//     throw error;
//   }
// };

export const getLikesAndComments = async (sessionID: string) => {
  try {
    const sessionUserID = sessionID.split('session')[0];
    const response = await axios.get(`${API_URL}/user/session?userID=${sessionUserID}&sessionID=${sessionID}`);
    const respData = response.data;

    const likes: Types.User[] = await Promise.all(
      respData.likes.slice(0,3).map((like: string) => getUser(like))
    );

    return {'likes': likes, 'numLikes':respData.likes.length as number ,'numComments': respData.comments.length as number};
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}