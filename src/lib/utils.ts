/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { EntityError } from "@/lib/http";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/types/jwt.types";
import { Role } from "@/constants/type";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  console.log(error, setError);
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error("Lỗi", {
      description: error?.payload?.message ?? "Lỗi không xác định",
      duration: duration ?? 5000,
    });
  }
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser ? localStorage.setItem("accessToken", accessToken) : null;

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser ? localStorage.setItem("refreshToken", refreshToken) : null;

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (params?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  // Kiểm tra token
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now  = Math.round(new Date().getTime() / 1000);
  if(decodedAccessToken.exp <= now) {
    removeTokensFromLocalStorage();
    return params?.onError && params.onError();
  }
  // kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  if(
    decodedAccessToken.exp - now < 
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ){
    try {
      const res = await authApiRequest.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      params?.onSuccess && params.onSuccess()
     
    } catch (error) {
      params?.onError && params.onError();
    }

  }

};
