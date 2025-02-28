import { openDB } from "idb";

let dbPromise = null;

if (typeof window !== "undefined") {
  dbPromise = openDB("MemeVerseDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("memes")) {
        db.createObjectStore("memes", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "username" });
      }
    },
  });
}

export const addMeme = async (meme) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!meme.id) return;
  await db.put("memes", meme);
};


export const getMemes = async () => {
  if (!dbPromise) return [];
  const db = await dbPromise;
  const memes = await db.getAll("memes");
  return memes.sort((a, b) => (b.date && a.date ? new Date(b.date) - new Date(a.date) : 0));
};

export const updateMeme = async (updatedMeme) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!updatedMeme.id) return;
  await db.put("memes", updatedMeme);
};

export const deleteMeme = async (memeId) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.delete("memes", memeId);
};

export const addUser = async (user) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!user.username) return;
  await db.put("users", user);
};

export const getUser = async (username) => {
  if (!dbPromise) return null;
  const db = await dbPromise;
  return await db.get("users", username);
};

export const clearMemes = async () => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.clear("memes");
};
