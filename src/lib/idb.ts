import { openDB } from "idb";

const openDatabase = async () => {
  return openDB("myDatabase", 1, {
    upgrade(db) {
      db.createObjectStore("timerStore");
      // db.createObjectStore("timerStore", {
      //   keyPath: "id",
      //   autoIncrement: true,
      // });
    },
  });
};

export const saveTime = async (seconds: number) => {
  const db = await openDatabase();
  await db.put("timerStore", seconds, "timerKey");
  // const tx = db.transaction("timerStore", "readwrite");
  // tx.store.add(time);
  // return tx.done;
};

export const getTime = async (): Promise<number | undefined> => {
  const db = await openDatabase();
  return db.get("timerStore", "timerKey");
};
