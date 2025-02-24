import { guestApiRequest } from "@/apiRequest/guest";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType;
  const cookieStore = cookies();
  try {
    const { response } = await guestApiRequest.serverLogin(body);
    const { accessToken, refreshToken } = response.data;
    const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(response);
  } catch (error) {
    console.log("error12345", error);
    return Response.json(
      {
        message: (error as any).response.message ?? "Error login in client",
      },
      {
        status: (error as any).response.statusCode,
      }
    );
  }
}
