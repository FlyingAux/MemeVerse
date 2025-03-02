const IMGFLIP_API_URL = "https://api.imgflip.com/get_memes";

/**
 * Fetches memes from Imgflip API.
 * @returns {Promise<Array>} 
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
 * 
 * @param {Array} memes 
 * @param {Object} updatedMeme 
 * @returns {Array} 
 */
export const updateMeme = (memes, updatedMeme) => {
  return memes.map((meme) =>
    meme.id === updatedMeme.id ? updatedMeme : meme
  );
};
