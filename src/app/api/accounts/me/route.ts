import accountApiRequest from "@/apiRequest/account";
import { ACCESS_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  console.log("accessToken get me", accessToken);
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

export async function PUT(request: Request) {
  const cookieStore = cookies();
  const body = (await request.json()) as UpdateMeBodyType;
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value || "";
  try {
    const result = await accountApiRequest.serverUpdateAccountMe(
      accessToken,
      body
    );
    return Response.json(result.response);
  } catch {
    return Response.json({
      message: "Error can not update account in client",
      status: HTTP_STATUS.OK,
    });
  }
}
