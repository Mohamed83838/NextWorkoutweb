import { getWorkouts } from "@/services/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        const decoded_user = request.headers.get("x-decoded-user")
        if (decoded_user === null) {
            return NextResponse.json({ message: "an error occured" }, { status: 501 })
        }
        const user = JSON.parse(decoded_user);
        const workouts = await getWorkouts(user)
        if (workouts === null) {
            return NextResponse.json({ message: "an error occured" }, { status: 501 })
        }
        return NextResponse.json({ message: "fetching workouts successfully", workouts }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 501 })
    }

}