'use client'
import { createContext, useState, useEffect } from "react";
import { getMemes, updateMeme } from "./utils/indexedDB";

export const MemeContext = createContext();

export const MemeProvider = ({ children }) => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        console.log("Fetching memes...");
        let storedMemes = await getMemes(); // Fetch from IndexedDB

        if (!storedMemes || storedMemes.length === 0) {
          const response = await fetch("https://api.imgflip.com/get_memes");
          const data = await response.json();

          if (!data.success) throw new Error("Failed to fetch Imgflip memes");

          const imgflipMemes = data.data.memes.map((meme) => ({
            id: meme.id,
            title: meme.name,
            imageUrl: meme.url,
            likes: 0,
            comments: [],
            category: "Random",
            user: "Imgflip",
            date: new Date().toISOString(),
          }));

          storedMemes = imgflipMemes;
          storedMemes.forEach(async (meme) => await updateMeme(meme));
        }

        setMemes(storedMemes);
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    };

    fetchMemes();
  }, []);

  return (
    <MemeContext.Provider value={{ memes, setMemes }}>
      {children}
    </MemeContext.Provider>
  );
};
