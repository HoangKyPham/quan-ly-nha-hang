import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
  Slogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
};

export default authApiRequest;
