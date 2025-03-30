import { addWorkout } from "@/services/firestore"
import { NextRequest, NextResponse } from "next/server"

export  async function POST(request:NextRequest){

    try {
        const decoded_user = request.headers.get("x-decoded-user")
        if (decoded_user === null) {
            return NextResponse.json({ message: "an error occured" }, { status: 2 })
        }
        const user = JSON.parse(decoded_user);
        const {workout}  = await request.json()
        console.log(workout)
       const id = await addWorkout( user,workout)
       if (id===null){
        return NextResponse.json({message:"an error occured"},{status:501})
       }
       return NextResponse.json({message:"Workout Added Successfully"},{status:201})
    } catch (error) {
        return NextResponse.json({message:error},{status:501})
    }
    
}