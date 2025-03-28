import { updateWorkout } from "@/services/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try {
        const decoded_user = request.headers.get("x-decoded-user")
        if (decoded_user === null) {
            return NextResponse.json({ message: "an error occured" }, { status: 501 })
        }
        const user = JSON.parse(decoded_user);
        const {workout}= await request.json();
        const id =await updateWorkout(user,workout)
        if(id === null){
            return NextResponse.json({message:"Internal error occured"},{status:501})
        }
        return NextResponse.json({message:"updated successfully"},{status:202})
    } catch (error) {
        return NextResponse.json({message:"Internal error occured"},{status:501})
    }
}