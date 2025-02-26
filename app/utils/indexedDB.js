import { openDB } from "idb";

let dbPromise = null;

// Ensure IndexedDB is only accessed in the browser
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

// ✅ Add a new meme (Ensuring `id` exists)
export const addMeme = async (meme) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!meme.id) return; // Prevent adding memes without an `id`
  await db.put("memes", meme);
};

// ✅ Get all memes (Sort only if `date` exists)
export const getMemes = async () => {
  if (!dbPromise) return [];
  const db = await dbPromise;
  const memes = await db.getAll("memes");
  return memes.sort((a, b) => (b.date && a.date ? new Date(b.date) - new Date(a.date) : 0));
};

// ✅ Update a meme (for likes, comments, etc.)
export const updateMeme = async (updatedMeme) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!updatedMeme.id) return; // Prevent updating if no ID
  await db.put("memes", updatedMeme);
};

// ✅ Delete a meme
export const deleteMeme = async (memeId) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.delete("memes", memeId);
};

// ✅ Add a new user
export const addUser = async (user) => {
  if (!dbPromise) return;
  const db = await dbPromise;
  if (!user.username) return; // Prevent adding users without a username
  await db.put("users", user);
};

// ✅ Get user by username
export const getUser = async (username) => {
  if (!dbPromise) return null;
  const db = await dbPromise;
  return await db.get("users", username);
};

// ✅ Clear all memes (for testing purposes)
export const clearMemes = async () => {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.clear("memes");
};
