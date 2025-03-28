import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return Response.json({ message: "auth cookie not found" },{status:404});
  }
  cookieStore.delete("authToken");
  return Response.json({ message: "auth cookie deleted successfully",  },{status:202});
}