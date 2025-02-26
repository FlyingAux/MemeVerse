import { openDB } from "idb";

let dbPromise = null;

// Ensure IndexedDB is only accessed in the browser
if (typeof window !== "undefined") {
  dbPromise = openDB("MemeVerseDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("memes")) {
        db.createObjectStore("memes", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "username" });
      }
    },
  });
}

// Add a new meme
export const addMeme = async (meme) => {
  if (!dbPromise) return; // Prevent execution during SSR
  const db = await dbPromise;
  await db.add("memes", meme);
};

// Get all memes
export const getMemes = async () => {
  if (!dbPromise) return []; // Prevent execution during SSR
  const db = await dbPromise;
  return await db.getAll("memes");
};

// Add a new user
export const addUser = async (user) => {
  if (!dbPromise) return; // Prevent execution during SSR
  const db = await dbPromise;
  await db.put("users", user);
};

// Get user by username
export const getUser = async (username) => {
  if (!dbPromise) return null; // Prevent execution during SSR
  const db = await dbPromise;
  return await db.get("users", username);
};

// Clear all memes (for testing purposes)
export const clearMemes = async () => {
  if (!dbPromise) return; // Prevent execution during SSR
  const db = await dbPromise;
  await db.clear("memes");
};
