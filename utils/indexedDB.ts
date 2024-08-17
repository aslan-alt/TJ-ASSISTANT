import {useQuery, useMutation, QueryClientContext} from '@tanstack/react-query';
import type { AccountItem } from "~constants";
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
            reject(`Request failed: ${event.target?.errorCode}`);
    });
}

async function handleTransaction(transaction: IDBTransaction): Promise<boolean> {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = (event) =>
            reject(`Transaction failed: ${event.target?.errorCode}`);
    });
}

// React Query Hook for getting accounts
export function useGetAccounts() {
    return useQuery({queryKey:['accounts'],
        queryFn:async () => {
            const store = await getStore();
            return handleRequest<AccountItem[]>(store.getAll());
        }});
}

// React Query Mutation for saving accounts
export function useSaveAccounts() {
    const queryClient = useContext(QueryClientContext);

    return useMutation(
        {
            mutationFn:async (accounts: AccountItem[]) => {
                const store = await getStore("readwrite");
                accounts.forEach(account => store.put(account));
                return (await handleTransaction(store.transaction)) ? accounts:[];
            },
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey:['accounts']});
            },
        }
    );
}

// React Query Mutation for deleting a single account
export function useDeleteAccount() {
    const queryClient = useContext(QueryClientContext);

    return useMutation(
        {
            mutationFn:async (email: string) => {
                const store = await getStore("readwrite");
                store.delete(email);
                return handleTransaction(store.transaction);
            },
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries({queryKey:['accounts']});
            },
        },

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
