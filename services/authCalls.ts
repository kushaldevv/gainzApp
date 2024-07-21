// import { useOAuth } from "@clerk/clerk-expo";
// import { useCallback } from "react";
// import { postUser } from "./apiCalls";
// const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple", });
// const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google", });

// // sign in with apple

// const onApplePress = useCallback(async () => {
    
//     if (!setActive) {
//       console.log("setActive is not available");
//       return;
//     }

//     try {
//       const { createdSessionId, signUp} = await startAppleOAuthFlow();
//       console.log("apple signUp: ", signUp);
      
//       const userID = signUp?.createdUserId;
//       const name = signUp?.firstName
//       if(userID) {
//         console.log(userID)
//         if (name){
//           console.log(name)
//           await postUser(userID, name);
//         } else {
//           await postUser(userID, "Apple User#") // append a pseudo-randomly generated number
//         }
       
//       }    

//       if (createdSessionId) {
//         setActive({ session: createdSessionId });
//       } else {
//         console.log("Sign in with Apple failed :(");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }, []);

//   // sign in with google
//   const onGooglePress = useCallback(async () => {
//     if (!setActive) {
//       console.log("setActive is not available");
//       return;
//     }

//     try {
//       const { createdSessionId, signUp } = await startGoogleOAuthFlow();
//       console.log(createdSessionId);

//       const userID = signUp?.createdUserId;
//       const name = signUp?.firstName
//       if(userID) {
//         console.log(userID)
//         if (name){
//           console.log(name)
//           await postUser(userID, name);
//         } else {
//           await postUser(userID, "Google User#") // append a pseudo-randomly generated number
//         }
       
//       }    

//       if (createdSessionId) {
//         setActive({ session: createdSessionId });
//       } else {
//         console.log("Sign in with Google failed :(");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }, []);