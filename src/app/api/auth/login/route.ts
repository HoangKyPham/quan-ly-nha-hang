import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const res = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequest.Slogin(res);
    const {
      data: { accessToken, refreshToken },
    } = payload;

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };

    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(decodedAccessToken.exp * 1000),
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(decodedRefreshToken.exp * 1000),
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra",
        },
        {
          status: 500,
        },
      );
    }
  }
}
