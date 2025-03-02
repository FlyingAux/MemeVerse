const IMGFLIP_API_URL = "https://api.imgflip.com/get_memes";

/**
 * Fetches memes from Imgflip API.
 * @returns {Promise<Array>} An array of memes.
 */
export const getMemes = async () => {
  try {
    const response = await fetch(IMGFLIP_API_URL);
    const data = await response.json();

    if (!data.success) throw new Error("Failed to fetch memes");

    return data.data.memes;
  } catch (error) {
    console.error("Error fetching memes:", error);
    return [];
  }
};

/**
 * Updates meme data locally (since there is no backend).
 * @param {Array} memes - Current memes array.
 * @param {Object} updatedMeme - The meme to be updated.
 * @returns {Array} Updated memes array.
 */
export const updateMeme = (memes, updatedMeme) => {
  return memes.map((meme) =>
    meme.id === updatedMeme.id ? updatedMeme : meme
  );
};
