import { normalizePath } from "@/config/utils";
import { envConfig } from "@/configTest/enviroment";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { EntityErrorResponse } from "@/types/error";
import { redirect } from "next/navigation";
import { EntityError, HttpError } from "./services";
import { isClient } from "./storage";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

let clientLogoutRequest: null | Promise<any> = null;
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const response: Response = await res.json();
  const data = {
    status: res.status,
    response,
  };

  if (!res.ok) {
    if (res.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
      throw new EntityError(
        data as {
          status: 422;
          response: EntityErrorResponse;
        }
      );
    } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            body: null,
            method: "POST",
            headers: {
              ...baseHeaders,
            },
          });
          try {
            await clientLogoutRequest;
          } catch {
          } finally {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            clientLogoutRequest = null;
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = "/";
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (["api/auth/login", "api/guest/auth/login"].includes(normalizeUrl)) {
      const { accessToken, refreshToken } = (response as LoginResType).data;
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
    } else if (
      ["api/auth/logout", "api/guest/auth/logout"].includes(normalizeUrl)
    ) {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
