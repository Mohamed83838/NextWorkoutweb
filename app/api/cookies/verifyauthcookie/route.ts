import { cookies } from "next/headers";
import { VerifyAuthToken } from "../../token/_methods/methods";

export async function GET() {
  const cookieStore = await cookies();
  const token =  cookieStore.get("authToken")?.value;
  

  if (!token) {
    return Response.json({ isAuthenticated: false });
  }
  const decoded =await VerifyAuthToken(token)
  if(decoded ===null){
    return Response.json({ isAuthenticated: false });
  }
  

  return Response.json({ isAuthenticated: true ,token,user:decoded});
}