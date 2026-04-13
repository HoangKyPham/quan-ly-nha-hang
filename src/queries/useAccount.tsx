import accountApiRequest from "@/apiRequests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
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

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountApiRequest.list
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
        exact: true
      })
    }
  })
}

export const useGetAccount = ({
  id,
  enabled
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled
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