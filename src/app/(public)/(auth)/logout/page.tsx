"use client";

import { useAppContext } from "@/components/app-provider";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const ref = useRef(null)

  
  

}

export default function LogoutPage() {
  return <div>page</div>;
}
