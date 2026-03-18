/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { EntityError } from "@/lib/http";

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
  console.log(error, setError)
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
      duration: duration ?? 5000
    });
  }
};

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
