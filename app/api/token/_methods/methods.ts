import { UserType } from "@/types/UserTypes";
import jwt from "jsonwebtoken";
export async function CreateAuthToken(user: UserType) {
    try {
        const payload = {
            id: user.id,  // Add user info (you can add more data if necessary)
            email: user.email,
            role: user.role,
            name: user.name
        };

        const secretKey: string = process.env.AUTH_TOKEN_SECRET_KEY || "";
        if (secretKey === "") {
            return null
        }
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '300min', // Token expiration (optional)
        });

        return token;
    } catch (error) {
        console.log(error);
        return null;
    }

}
// Verify The Auth Token
export  async function VerifyAuthToken (token: string)  {
  
    // Get The The Secret Key 
    const secretKey: string =  process.env.AUTH_TOKEN_SECRET_KEY || "" ;
    
        if (secretKey === "") {
            return null
        }
    try {
        console.log(token)
      // Verify the token using the secret key
      const decoded =  jwt.verify(token, secretKey);

      return decoded;  // If the token is valid, return the decoded payload
    } catch (err) {
        console.log(err)
        return null
      
    }
  };