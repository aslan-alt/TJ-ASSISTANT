import {useQuery, useMutation, QueryClientContext} from '@tanstack/react-query';
import {type AccountItem, envOptions, roleOptions} from "~constants";
import {useContext} from "react";

const DB_NAME = "MyExtensionDatabase";
const STORE_NAME = "accounts";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "email" });
            }
        };

        request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
        request.onerror = (event) =>
            // @ts-ignore
            reject(`Failed to open database: ${event.target?.errorCode}`);
    });
}

async function getStore(
    mode: IDBTransactionMode = "readonly"
): Promise<IDBObjectStore> {
    const db = await openDatabase();
    return db.transaction([STORE_NAME], mode).objectStore(STORE_NAME);
}

async function handleRequest<T>(request: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) =>
            // @ts-ignore
            reject(`Request failed: ${event.target?.errorCode}`);
    });
}

async function handleTransaction(transaction: IDBTransaction): Promise<boolean> {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = (event) =>
            // @ts-ignore
            reject(`Transaction failed: ${event.target?.errorCode}`);
    });
}

// React Query Hook for getting accounts
export function useGetAccounts() {
    return useQuery({
        queryKey:['accounts'],
        queryFn:async () => {
            const store = await getStore();
            return handleRequest<AccountItem[]>(store.getAll());
        },
        select:(accounts)=>{
            return  accounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
    });
}

// React Query Mutation for saving accounts
export function useSaveAccounts() {
    const queryClient = useContext(QueryClientContext);

    return useMutation(
        {
            mutationFn:async (accounts: AccountItem[]) => {
                const store = await getStore("readwrite");
                store.clear();
                const result = accounts.map((account) => {
                    const formatedAccount = {
                        ...account,
                        env:typeof account.env === 'string'?{[account.env]:account.env} : (account.env||envOptions[0]),
                        role: typeof account.role === 'string'?{[account.role]:account.role} : (account.role||roleOptions[0]),
                        createdAt:account?.createdAt || new Date().toISOString()
                    }
                    store.put(formatedAccount)
                    return formatedAccount
                }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                return  {
                    success:(await handleTransaction(store.transaction)),
                    result,
                    code:200
                };
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey:['accounts']});
            },
        }
    );
}

// React Query Mutation for deleting all accounts
export function useDeleteAllAccounts() {
    const queryClient = useContext(QueryClientContext);

    return useMutation(
        {
            mutationFn:async () => {
                const store = await getStore("readwrite");
                store.clear();
                return handleTransaction(store.transaction);
            },
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey:['accounts']
                });
            },
        }
    );
}
