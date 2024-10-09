import { authApiRequest } from "@/apiRequest/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value || "";
  try {
    const result = await authApiRequest.serverLogout({
      refreshToken,
      accessToken,
    });
    if (result.status === 200) {
      cookieStore.delete(ACCESS_TOKEN);
      cookieStore.delete(REFRESH_TOKEN);
    }
    return Response.json(result.response);
  } catch {
    return Response.json({
      message: "Error logout in backend",
      status: 200,
    });
  }
}
