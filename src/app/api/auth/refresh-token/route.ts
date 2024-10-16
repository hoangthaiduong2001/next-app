import { authApiRequest } from "@/apiRequest/auth";
import { HTTP_STATUS } from "@/constants/status";
import { RefreshTokenBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
  const body = (await request.json()) as RefreshTokenBodyType;
  try {
    const result = await authApiRequest.serverRefreshToken(body);
    return Response.json(result.data);
  } catch {
    return Response.json({
      message: "Error refresh token in client",
      status: HTTP_STATUS.OK,
    });
  }
}
