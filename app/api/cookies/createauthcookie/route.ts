import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CreateAuthToken } from "../../token/_methods/methods";

export async function POST(req: NextRequest) {

  try {

    const { user } = await req.json();
    const token = await CreateAuthToken(user)
    if (token === null) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
    // Await the cookies() call to get the cookie store.
    const cookieStore = await cookies();

    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // More compatible than 'strict'
      path: "/",
      maxAge: 60 * 60, //one hour
    });

    return NextResponse.json(
      { message: "Logged in successfully", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
