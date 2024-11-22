import { authApiRequest } from "@/apiRequest/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Can not get refresh token",
      },
      {
        status: HTTP_STATUS.UNAUTHORIZED,
      }
    );
  }
  try {
    const { response } = await authApiRequest.serverRefreshToken({
      refreshToken,
    });
    const decodeAccessToken = jwt.decode(response.data.accessToken) as {
      exp: number;
    };
    const decodeRefreshToken = jwt.decode(response.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set(ACCESS_TOKEN, response.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStore.set(REFRESH_TOKEN, response.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(response);
  } catch {
    cookieStore.delete(ACCESS_TOKEN);
    cookieStore.delete(REFRESH_TOKEN);
    return Response.json(
      {
        message: "Error refresh token in client",
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    );
  }
}
