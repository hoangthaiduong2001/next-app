import http from "@/config/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  serverUploadImage: (accessToken: string, formData: FormData) =>
    http.post<UploadImageResType>("/media/upload", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  clientUploadImage: (formData: FormData) =>
    http.post<UploadImageResType>("/api/media/upload", formData, {
      baseUrl: "",
    }),
};

export default mediaApiRequest;
