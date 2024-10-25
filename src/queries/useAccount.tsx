import accountApiRequest from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAccountMe = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })
}