import { signInWithGoogle } from "@/services/auth";
import { UserType } from "@/types/UserTypes";
import axios from "axios";

export async function Login() {
    
    try {
      const googleuser=  await signInWithGoogle();
      const user : UserType = {
        id:googleuser.uid,
        name:googleuser.displayName || "",
        email:googleuser.email || "",
        role:"user"
      } 
     await axios.post(
        "http://localhost:3001/api/cookies/createauthcookie",
        { user: user }, // Request body
        {
          headers: {
            "X-Internal-Access": "mohammedfraj"
          }
        }
      );
      return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function GetAuthToken() {
  try {

    const response = await axios.get("http://localhost:3001/api/cookies/verifyauthcookie");
    const { isAuthenticated, token } = response.data;
    return isAuthenticated ? token : null;

  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}
export async function GetUser() {
  try {

    const response = await axios.get("http://localhost:3001/api/cookies/verifyauthcookie");
    const { isAuthenticated,user } = response.data;
    return isAuthenticated ? user : null;

  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}
export async function Logout() {
  try {

    const response = await axios.get("http://localhost:3001/api/cookies/removeauthcookie");
    if(response.status===202){
      return true;

    }else{
      return null
    }

  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}
