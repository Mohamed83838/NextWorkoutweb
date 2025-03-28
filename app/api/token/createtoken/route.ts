import { UserType } from "@/types/UserTypes";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CreateAuthToken } from "../_methods/methods";
export async function POST(request: NextRequest) {

  try {
    const {user}  =await  request.json();
    if (user === null) {
      return NextResponse.json({ message: "Invalid Request Format" }, { status: 400 })
    }
    const token = await CreateAuthToken(user)
    return NextResponse.json({token,message:"token created successfully"},{status:201})
  } catch (error) {
    return NextResponse.json({message:"Internal server error"},{status:500})
  }

}