import accountApiRequest from "@/apiRequests/account"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



export const useAccountMe = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['accounts']})
    }
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['accounts']})
    }
  })
}