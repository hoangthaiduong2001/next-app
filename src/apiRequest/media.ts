import http from "@/config/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const mediaApiRequest = {
  uploadImage: (formData: FormData) => http.post<UploadImageResType>("/media/upload", formData),
};

export default mediaApiRequest;
