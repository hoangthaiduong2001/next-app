import { authApiRequest } from "@/apiRequest/auth";
import { HTTP_STATUS } from "@/constants/status";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = cookies();
  try {
    const { response } = await authApiRequest.serverLogin(body);
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
  } catch  {
    return Response.json({
      message: "Error login in client",
    }, {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}
