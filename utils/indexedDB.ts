export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MyExtensionDatabase", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("accounts")) {
                db.createObjectStore("accounts", { keyPath: "email" });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Failed to open database: " + event.target.errorCode);
        };
    });
}

export function saveAccounts(accounts) {
    return openDatabase().then((db) => {
        const transaction = db.transaction(["accounts"], "readwrite");
        const store = transaction.objectStore("accounts");

        accounts.forEach((account) => {
            store.put(account);
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve(true);
            };
            transaction.onerror = (event) => {
                reject("Failed to save accounts: " + event.target.errorCode);
            };
        });
    });
}

export function getAccounts() {
    return openDatabase().then((db) => {
        const transaction = db.transaction(["accounts"], "readonly");
        const store = transaction.objectStore("accounts");

        return new Promise((resolve, reject) => {
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject("Failed to get accounts: " + event.target.errorCode);
            };
        });
    });
}

export function deleteAccount(email) {
    return openDatabase().then((db) => {
        const transaction = db.transaction(["accounts"], "readwrite");
        const store = transaction.objectStore("accounts");

        store.delete(email);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve(true);
            };
            transaction.onerror = (event) => {
                reject("Failed to delete account: " + event.target.errorCode);
            };
        });
    });
}

