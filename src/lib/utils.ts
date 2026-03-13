import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UseFormSetError } from "react-hook-form"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const handleErrorApi = ({
//   error,
//   setError,
//   duration 
// } : {
//   error: any
//   setError?:UseFormSetError<any>
//   duration?: number
// }) => {

// }

export const normalizePath = (path : string) => {
  return path.startsWith("/") ? path.slice(1) : path 
}


