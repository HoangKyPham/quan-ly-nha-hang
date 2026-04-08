import accountApiRequest from "@/apiRequests/account"
import { useQuery } from "@tanstack/react-query"



export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me
  })
}