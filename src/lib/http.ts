/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
  };
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
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

  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    throw new HttpError(data);
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, {
      ...options,
      body,
    });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, {
      ...options,
      body,
    });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
