import {
  QueryClientContext,
  useMutation,
  useQuery
} from "@tanstack/react-query"
import { useContext } from "react"

import { envOptions, roleOptions, type AccountItem } from "~constants"

const DB_NAME = "MyExtensionDatabase"
const DB_VERSION = 1

export enum StoreNames {
  All = "accounts",
  Login = "loginAccounts",
  Impersonate = "impersonateAccounts"
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(StoreNames.All)) {
        db.createObjectStore(StoreNames.All, { keyPath: "email" })
      }
      if (!db.objectStoreNames.contains(StoreNames.Login)) {
        db.createObjectStore(StoreNames.Login, { keyPath: "email" })
      }
      if (!db.objectStoreNames.contains(StoreNames.Impersonate)) {
        db.createObjectStore(StoreNames.Impersonate, { keyPath: "email" })
      }
    }

    request.onsuccess = (event) =>
      resolve((event.target as IDBOpenDBRequest).result)
    request.onerror = (event) =>
      // @ts-ignore
      reject(`Failed to open database: ${event.target?.errorCode}`)
  })
}

type GetStore = {
  mode: IDBTransactionMode
  storeName: StoreNames
}

async function getStore(
  { mode, storeName }: GetStore = {
    mode: "readonly",
    storeName: StoreNames.All
  }
): Promise<IDBObjectStore> {
  const db = await openDatabase()
  return db.transaction([storeName], mode).objectStore(storeName)
}

async function handleRequest<T>(request: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = (event) =>
      // @ts-ignore
      reject(`Request failed: ${event.target?.errorCode}`)
  })
}

async function handleTransaction(
  transaction: IDBTransaction
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true)
    transaction.onerror = (event) =>
      // @ts-ignore
      reject(`Transaction failed: ${event.target?.errorCode}`)
  })
}

// React Query Hook for getting accounts
export function useGetAccounts(storeName = StoreNames.All) {
  return useQuery({
    queryKey: [storeName],
    queryFn: async () => {
      const store = await getStore({ mode: "readonly", storeName })
      return handleRequest<AccountItem[]>(store.getAll())
    },
    select: (accounts) => {
      return accounts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
  })
}

export function useUpdateAccounts(storeName: StoreNames) {
  const queryClient = useContext(QueryClientContext)

  return useMutation({
    mutationKey: [storeName],
    mutationFn: async (accounts: AccountItem[]) => {
      const store = await getStore({ mode: "readwrite", storeName })
      store.clear()
      const result = accounts
        .map((account) => {
          const formatedAccount = {
            ...account,
            createdAt: account?.createdAt || new Date().toISOString()
          }
          store.put(formatedAccount)
          return formatedAccount
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      return {
        success: await handleTransaction(store.transaction),
        result,
        code: 200
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [storeName] })
    }
  })
}

// React Query Mutation for deleting all accounts
export function useDeleteAllAccounts(storeName = StoreNames.All) {
  const queryClient = useContext(QueryClientContext)

  return useMutation({
    mutationFn: async () => {
      const store = await getStore({ mode: "readwrite", storeName })
      store.clear()
      return handleTransaction(store.transaction)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: [storeName]
      })
    }
  })
}
