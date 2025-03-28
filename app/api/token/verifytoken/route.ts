import { UserType } from "@/types/UserTypes";
import { VerifyAuthToken } from "../_methods/methods";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {token} =await request.json();
     
        
        const decoded =await VerifyAuthToken(token)
        if(decoded == null){
            return NextResponse.json({message:"invalid token"},{status:401});
        }
        return NextResponse.json({message:"valid token",decoded},{status:200});
    } catch (error) {
        return NextResponse.json({message:"Internal Server error "},{status:500});
    }
}