import accountApiRequest from "@/apiRequest/account";
import { ACCESS_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  try {
    const result = await accountApiRequest.serverGetAccount(accessToken);
    return Response.json(result.response);
  } catch {
    return Response.json({
      message: "Error can not get account in client",
      status: HTTP_STATUS.OK,
    });
  }
}
