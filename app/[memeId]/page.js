"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMemes } from "../utils/indexedDB";

const MemeDetail = () => {
  const router = useRouter();
  const { memeId } = useParams();
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const localMemes = await getMemes();
        const foundLocalMeme = localMemes.find((m) => String(m.id) === String(memeId));

        if (foundLocalMeme) {
          setMeme(foundLocalMeme);
          return;
        }

        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        const apiMemes = data.data.memes || [];

        const foundApiMeme = apiMemes.find((m) => String(m.id) === String(memeId));

        if (foundApiMeme) {
          setMeme(foundApiMeme);
          return;
        }

        router.push("/404");
      } catch (error) {
        console.error("Error fetching meme:", error);
        router.push("/404");
      }
    };

    if (memeId) fetchMeme();
  }, [memeId, router]);

  if (!meme) return <p className="text-center text-gray-500 dark:text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-purple-300 px-4 py-8">
      <div className="w-full max-w-2xl rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-purple-100 dark:bg-purple-400 shadow-lg">
        <button 
          onClick={() => router.back()} 
          className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm sm:text-base"
        >
          ← Back
        </button>

        {/* Strict Image Sizing with Fixed Height */}
        <div className="w-full max-w-lg h-80 md:h-96 flex justify-center">
          <img 
            src={meme.imageUrl || meme.url} 
            alt={meme.title || meme.name} 
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-4 text-gray-900 dark:text-white text-center">
          {meme.title || meme.name}
        </h2>

        <p className="text-gray-600 dark:text-white text-sm sm:text-base">
          Uploaded by <span className="font-semibold">{meme.user || "Imgflip"}</span>
        </p>

        <p className="text-red-500 text-md sm:text-lg font-semibold mt-2">
          ❤️ {meme.likes || 0} Likes
        </p>
      </div>
    </div>
  );
};

export default MemeDetail;
