import { authApiRequest } from "@/apiRequest/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.response.data.message,
        error: error.response.data.errors,
        status: error.status,
      },
      { status: error.status }
    );
  }
}
