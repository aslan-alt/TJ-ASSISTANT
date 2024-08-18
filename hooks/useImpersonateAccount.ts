import type {AccountItem} from "~constants";
import {StoreNames, useGetAccounts, useUpdateAccounts} from "~utils/indexedDB";


export const useImpersonateAccount = () => {
    const {data:impersonateAccounts,...rest} =useGetAccounts(StoreNames.Impersonate)
    const {mutate} = useUpdateAccounts(StoreNames.Impersonate)

    const updateImpersonateAccounts = (newAccounts:AccountItem[])=>{
        mutate(newAccounts)
    }


    return {
        impersonateAccounts,
        updateImpersonateAccounts,
        ...rest
    }
}