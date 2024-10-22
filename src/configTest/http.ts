import { envConfig } from "@/configTest/enviroment";

import { normalizePath } from "@/config/utils";
import { pathClient, pathServer } from "@/routes/path";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { CustomOptions, IPlainObject } from "@/types/common";
import { AxiosHeaders } from "axios";
import axiosHttp from "./axiosConfig";
import { clearPersistToken, persistTokenAndAccount } from "./storage";

// let clientLogoutRequest: null | Promise<any> = null;

const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: IPlainObject =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (!isClient && url !== pathServer.login) {
    baseHeaders.Authorization = (
      options?.headers as AxiosHeaders
    ).Authorization;
  }
  const axiosInstance = axiosHttp({ baseURL: baseUrl, headers: baseHeaders });

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await axiosInstance({
    method,
    url: fullUrl,
    data: body,
    headers: {
      ...baseHeaders,
    },
  });
  const responseData: Response = await res.data;
  const data = {
    status: res.status,
    response: responseData,
  };
  if (isClient) {
    if (url === pathClient.login) {
      const data = responseData as LoginResType;
      persistTokenAndAccount(data);
    } else if (url === pathClient.logout) {
      clearPersistToken();
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
