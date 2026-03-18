import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
  Slogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  login : (body : LoginBodyType) => http.post<LoginResType>("/api/auth/login", body,{ baseUrl: '' })
};

export default authApiRequest;
