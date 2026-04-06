import http from "@/lib/http";
import { LoginBodyType, LoginResType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import { refresh } from "next/cache";

const authApiRequest = {
  refreshTokenRequest : null as Promise<{
    status: number;
    payload : RefreshTokenResType;
  }> | null,
  Slogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
  logoutFromNextServerToServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post<MessageResType>(
      "/auth/logout",
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  logout: (
    body: {
      refreshToken: string;
    },
  ) =>
    http.post<MessageResType>("/api/auth/logout", body, {
      baseUrl: "",
    }),
    sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),
    async refreshToken(){
      if(this.refreshTokenRequest){
        return this.refreshTokenRequest
      }
      this.refreshTokenRequest = http.post<RefreshTokenResType>(
        "/api/auth/refresh-token",
        null,
        {
          baseUrl: "",
        }
      )
      const result = await this.refreshTokenRequest
      this.refreshTokenRequest = null
      return result
    }
};

export default authApiRequest;
