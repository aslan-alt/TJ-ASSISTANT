import {useQuery} from "@tanstack/react-query";

export const useGetLoginAccount = () => {
    return useQuery({
        queryKey:['useGetLoginAccount']
    })
}