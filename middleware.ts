// /app/api/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import axios from 'axios';
export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.startsWith('/api/session')||request.nextUrl.pathname.startsWith('/api/cookies/createauthcookie')) {
    // This logic is only applied to /about
      // Get the token from headers
  const internalAccessToken = request.headers.get('X-Internal-Access');
  console.log(internalAccessToken)
  // Get The INTERNAL API TOKEN
  const validToken = process.env.INTERNAL_API_TOKEN;

  if (!internalAccessToken) {
    // Return a JSON response with a 401 status if no token is found
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (internalAccessToken !== validToken) {

    // If the token doesn't match, return a 403 Forbidden
    return NextResponse.json({ error: 'Forbidden: Invalid Access Token' }, { status: 403 });
  }
  }
 
  if (request.nextUrl.pathname.startsWith('/api/workouts')) {
    try {
      
    const token= request.headers.get("token") || "";
    const response = await axios.post(
      "https://next-workoutweb-pf4p.vercel.app/api/token/verifytoken",
      { token: token }, // Request body (data)
      {
        headers: { 
          "X-Internal-Access": process.env.INTERNAL_API_TOKEN // Headers in the config object
        }
      }
    );
      const {decoded} =await response.data;
 
      if(decoded !== null){
        const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-decoded-user', JSON.stringify(decoded));
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      }
      return  NextResponse.json({message:"unauthorized"},{status:401})
    } catch (error) {
    return  NextResponse.json({message:"unauthorized",error},{status:401})
    }


  }


  return NextResponse.next();
}

