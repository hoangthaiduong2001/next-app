import mediaApiRequest from "@/apiRequest/media";
import { ACCESS_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const formData = await request.formData();
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  try {
    const result = await mediaApiRequest.serverUploadImage(
      accessToken,
      formData
    );
    return Response.json(result.response);
  } catch {
    return Response.json({
      message: "Error upload image in client",
      status: HTTP_STATUS.OK,
    });
  }
}
