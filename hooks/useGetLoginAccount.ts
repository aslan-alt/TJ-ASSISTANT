import {isEmpty} from "lodash"
import {useGetAccounts, useSaveAccounts} from "~utils/indexedDB";
import {useEffect, useState} from "react";
import {type AccountItem} from "~constants";

export const useGetLoginAccount = () => {
    const [loginAccounts,setLoginAccounts] = useState<AccountItem[]>([])
    const {data:accounts,...rest} =useGetAccounts()
    const {mutate} = useSaveAccounts()

    const updateLoginAccount = (newLoginAccounts:AccountItem[])=>{
        mutate(newLoginAccounts)
    }

    useEffect(() => {
        setLoginAccounts(accounts)
    }, [accounts]);

    return {
        loginAccounts,
        setLoginAccounts,
        updateLoginAccount
    }
}