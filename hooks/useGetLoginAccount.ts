import {StoreNames, useGetAccounts, useUpdateAccounts} from "~utils/indexedDB";
import {type AccountItem} from "~constants";

export const useGetLoginAccount = () => {
    const {data:loginAccounts,...rest} =useGetAccounts(StoreNames.Login)
    const {mutate} = useUpdateAccounts(StoreNames.Login)

    const updateLoginAccount = (newLoginAccounts:AccountItem[])=>{
        mutate(newLoginAccounts)
    }



    return {
        loginAccounts,
        updateLoginAccount
    }
}