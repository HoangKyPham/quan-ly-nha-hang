import accountApiRequest from "@/apiRequests/account"
import { useQuery } from "@tanstack/react-query"



export const useAccountQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['account', 'me'],
    queryFn: accountApiRequest.me,
    enabled
  })
}