import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  Slogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) => http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
  logoutFromNextServerToServer: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) =>
    http.post<MessageResType>(
      '/auth/logout',
      {
        refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ),
  logout: (
    body: {
      refreshToken: string
    }
  ) =>
    http.post<MessageResType>('/api/auth/logout', body, {
      baseUrl: '',
    })
};

export default authApiRequest;
