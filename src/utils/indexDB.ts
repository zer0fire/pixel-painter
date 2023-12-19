export const initDB = (dbName: string, dbType = 3) => {
    if (window.indexedDB) {
        //
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(dbName, dbType);
            request.onerror = () => {
                console.error(
                    "Why didn't you allow my web app to use IndexedDB?!"
                );
                reject();
            };
            request.onsuccess = (event: any) => {
                let db = event.target.result;
                resolve(db);
            };
        });
    } else {
        throw Error("Not Support IndexDB");
    }
};
