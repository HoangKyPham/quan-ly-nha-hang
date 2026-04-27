import guestApiRequest from '@/apiRequests/guest'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}



