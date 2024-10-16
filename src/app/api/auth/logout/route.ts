import { authApiRequest } from "@/apiRequest/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value || "";
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);
  try {
    const result = await authApiRequest.serverLogout({
      refreshToken,
      accessToken,
    });
    if (result.status === HTTP_STATUS.OK) {
      cookieStore.delete(ACCESS_TOKEN);
      cookieStore.delete(REFRESH_TOKEN);
    }
    return Response.json(result.response);
  } catch {
    return Response.json({
      message: "Error logout in client",
      status: HTTP_STATUS.OK,
    });
  }
}
