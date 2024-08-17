import {useEffect, useState} from "react";
import {defaultUserConfigs, envOptions, roleOptions} from "~constants";
import {getAccounts} from "~utils/indexedDB";
import type {AccountItem} from "~components/Settings";
import {isEmpty} from "lodash";
import { v4 as uuidv4 } from "uuid"

export const useGetLoginAccounts = () => {
    const [loginAccounts, setLoginAccounts] = useState<
        (typeof defaultUserConfigs)[]
    >([])

    useEffect(()=>{
        getAccounts().then(res=>{

            setLoginAccounts((state)=>{
                const accountFromExcel = (res as AccountItem[]).filter(item=>!isEmpty(item.password)).map(item=>({
                    email: item.email,
                    password: item.password,
                    tag:`${item?.role??''} (${item.displayName??'N/A'})`,
                    env: envOptions[0] as typeof defaultUserConfigs.env,
                    role: roleOptions[1] as typeof defaultUserConfigs.role,
                }));

                return [...state,...accountFromExcel]
            });
        })
    },[])

}