import axios from 'axios';
import * as Types from '@/types';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}

export const getAllExercises = async(sessionID: string) => {
  try {
    const sessionUserID = sessionID.split('session')[0];
    // Send a GET request to get a map of all exercises for a user
    const response = await axios.get(`${API_URL}/user/exercises/all?userID=${sessionUserID}`);
    const responseData = response.data;
    const randomNum = getRandomInt(10);

    // responseData.entries() returns an iterator of a Map's key-value pairs
    // [...responseData.entries()] spreads the iterator into an array of kv pairs
    // we destructure the kv pair, and provide an index
    [...responseData.entries()].forEach(([key, value], index) => {
      if (randomNum === index) {
        console.log("PR: ", value.PR);
        return value.PR;
      }
    });

  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

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
      "searchName"  : name.toLowerCase(),
      "name": name,
      "pfp": `https://ui-avatars.com/api/?name=${name.charAt(0)}&background=00cccc&color=fff`, 
      "following": [userID],
      "followers": [],
      "sessions": {},
      "notis": [],
      "exercises" : {}
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
export const getUserProfile = async (userID: string): Promise<Types.UserProfile> => {
  try {
    const response = await axios.get(`${API_URL}/user/profile?userID=${userID}`);
    const data = response.data;

    const followersPromises = data.followers.map((friendId: string) => getUser(friendId));
    const followers: Types.User[] = await Promise.all(followersPromises);
    const followingPromises = data.following.map((friendId: string) => getUser(friendId));
    const following: Types.User[] = await Promise.all(followingPromises);

    const getDayAbbr = (date: Date): string => {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    };

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const pastSevenDays: string[] = [];
    const groupedByDay: { [key: string]: Types.dateDuration[] } = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayAbbr = getDayAbbr(date);
      pastSevenDays.push(dayAbbr);
      groupedByDay[dayAbbr] = [];
    }

    let highestDuration = 0;
    let highestDurationDay = '';

    // Sort dateDuration array by date in descending order
    const sortedDateDurations = data.dateDuration.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Set to start of day for comparison

    data.dateDuration.reduce((acc: Types.dateDuration[], item: any) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);  // Set to start of day for comparison

      // Streak calculation
      if (itemDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (itemDate.getTime() < currentDate.getTime()) {
        // Break streak if a day is missed
        currentDate = itemDate;
        streak = 1;
      }

      if (itemDate >= sevenDaysAgo && itemDate <= today) {
        if (item.duration > highestDuration) {
          highestDuration = item.duration;
          highestDurationDay = item.date;
        }
        const dateDuration: Types.dateDuration = {
          date: item.date as string,
          duration: item.duration as number
        };
        const dayAbbr = getDayAbbr(itemDate);
        groupedByDay[dayAbbr].push(dateDuration);
        acc.push(dateDuration);
      }
      return acc;
    }, []);

    const userProfile: Types.UserProfile = {
      id: data.userID as string,
      name: data.name as string,
      pfp: data.pfp as string,
      followers: followers,
      following: following,
      recentSessions: groupedByDay,
      highestDuration: { date: highestDurationDay, duration: highestDuration },
      streak: streak
    };

    return userProfile;
  } catch (error) {
    throw error;
  }
};

export const getFollowingSessions = async (userID: string) => {
  try {
    const following = await getUserFollowingList(userID) as string[];
    const followingSessions = await Promise.all(following.map(async (friend) => getUserSessions(friend, userID)));
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

export const getUserSessions = async (sessionUserID: string, userID: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/sessions?userID=${sessionUserID}`);
    const data = response.data;
    const sessions = await Promise.all(

      Object.entries(data).map(async ([sessionID, sessionData]: [string, any]) => {
        const likes: Types.User[] = await Promise.all(
          sessionData.likes.map((like: string) => getUser(like))
        );

        const exercises = await getExercisesInfo(sessionID);

        const session: Types.Session = {
          id: sessionID,
          name: sessionData.name as string,
          user: await getUser(sessionUserID) as Types.User,
          location: sessionData.location as string,
          date: sessionData.date as string,
          exercises: exercises as Types.Exercise[], 
          duration: sessionData.duration as number,
          comments: sessionData.comments,
          likes: likes,
          numLikes: sessionData.numLikes as number,
          userLiked: sessionData.likes.includes(userID)
        };
        return session;
      })
    );
    return sessions;
  } catch (error) {
    console.log('getting user sessions', error);
    throw error;
  }
};

/**
 * Returns an exercise response that details a PR, and exerciseInfo include date, reps, and weight
 * 
 * @param userID - The unique identifier of the user.
 * @param sessionID - The unique identifier of the session.
 * @returns A Promise that resolves when a exercise response is returned
 * @throws Will throw an error if the API request fails.
 */
export const getExercisesInfo = async(sessionID: string) => {
  const sessionUserID = sessionID.split('session')[0];

  try {
    // Send a GET request to get a info about a user's exercises
    const response = axios.get(`${API_URL}/user/exercises?userID=${sessionUserID}&sessionID=${sessionID}`);
    const data = (await response).data;
    const exercises: Types.Exercise[] = data.map((exercise: any ) => ({
      name: exercise.name as string,
      date: exercise.exerciseInfo.date as string,
      pr: exercise.PR as number,
      reps: exercise.exerciseInfo.reps as number[],
      weight: exercise.exerciseInfo.weight as number[]
    }));

    return exercises;
  } catch (error) {
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
//       numLikes: respData.likes.length as number,
//     };
//     return session;
//   } catch (error) {
//     // Re-throw the error for the caller to handle
//     throw error;
//   }
// };

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
    return following as Types.User[];
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}

export const getUserFollowingList = async (userID: string) => {
  try {
    // Make a GET request to fetch the following for a user
    const response = await axios.get(`${API_URL}/user/following?userID=${userID}`);
    return response.data as string[];
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error;
  }
}


/**
 * Fetches the followers for a user
 *
 * @param id - The unique identifier of the user to fetch.
 * @returns A Promise that resolves to a list of follower.
 * @throws Will throw an error if the API request fails or if there's an issue processing the response.
 */
export const getUserFollowers = async (userID: string) => {
  try {
    // Make a GET request to fetch the following for a user
    const response = await axios.get(`${API_URL}/user/followers?userID=${userID}`);
    const followers = await Promise.all(response.data.map(async (followerID: string) => await getUser(followerID)));
    return followers as Types.User[];
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

/**
 * Gets all the users that correspond to the query
 * 
 * @param query - The query
 * @returns A Promise that resolves when a list of users is returned
 * @throws Will throw an error if the API request fails.
 */
export const getUsers = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/users?q=${query}`);
    const responseData = response.data;

    const users: Types.User[] = responseData.map((user: any) => {
      return {
        id: user.id as string,
        name: user.name as string,
        pfp: user.pfp as string
      };
    });
    return users;
  } catch (error) {
    throw error;
  }
}

/**
 * Append userID2 to the following list of userID1, and append userID1 to the followers list of userID2
 * 
 * @param userID1 - The unique identifier of the first user.
 * @param userID2 - The unique identifier of the second user
 * @returns A Promise that resolves when both userID1 and userID2 are appended to their respective lists
 * @throws Will throw an error if the API request fails.
 */
export const appendFollowing = async(userID1: string, userID2: string) => {
  try {
    // payload to sent to patch request
    const payload = {
      "userID1": userID1,
      "userID2": userID2
    }
     // Send a PATCH request to append userID2 to the following list of userID1, and append userID1 to the followers list of userID2
    await axios.patch(`${API_URL}/user/following?userID1=${userID1}&userID2=${userID2}`, payload);
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}

/**
 * Gets the notifications of a user
 * 
 * @param userID - The unique identifier of the first user.
 * @returns A Promise that resolves when the notifications of a user is returned
 * @throws Will throw an error if the API request fails.
 */
export const getNotis = async(userID: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/notis?userID=${userID}`);
    const data = response.data;
    
    // Traverses thru all notis, in data and creates and returns a noti type. An array of notis is return at the end
    const notis: Types.Noti[] = await Promise.all(
      data.map(async (notiData: any) => {
        const noti: Types.Noti = {
          sessionID: notiData.sessionID, // Assuming each notification has an ID
          user: await getUser(notiData.userID) as Types.User,
          date: notiData.date,
          type: notiData.type 
        };
        return noti;
      })
    );
    return notis;
  } catch (error) {
    // If an error occurs during the API request, re-throw it
    throw error;
  }
}
