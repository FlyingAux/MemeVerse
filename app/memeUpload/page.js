"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMeme } from "../utils/indexedDB";
import LoginModal from "../utils/LoginModal";
import { motion } from "framer-motion";

const UploadMeme = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [memeTemplates, setMemeTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        alert("Please log in to upload memes.");
        setShowLoginModal(true);
        router.push("/");
      }
    }
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        if (data.success) {
          setMemeTemplates(data.data.memes.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching meme templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsConfirmed(false);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setImagePreview(template.url);
    setImage(null);
    setTopText("");
    setBottomText("");
  };

  const generateMeme = async () => {
    if (!selectedTemplate) {
      alert("Please select a meme template.");
      return;
    }
    if (!topText.trim() && !bottomText.trim()) {
      alert("Please enter at least one caption.");
      return;
    }

    setLoading(true);

    const params = new URLSearchParams({
      template_id: selectedTemplate.id,
      username: process.env.NEXT_PUBLIC_IMGFLIP_USERNAME,
      password: process.env.NEXT_PUBLIC_IMGFLIP_PASSWORD,
      text0: topText,
      text1: bottomText,
    });

    try {
      const response = await fetch(`https://api.imgflip.com/caption_image?${params}`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("Generated Meme Response:", data);

      if (data.success) {
        setImagePreview(data.data.url);
        setIsConfirmed(true); 
      } else {
        alert("Failed to generate meme. Please check Imgflip API credentials.");
      }
    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Error generating meme.");
    } finally {
      setLoading(false);
    }
  };

  const confirmUpload = () => {
    if (!title || (!image && !imagePreview)) {
      alert("Please provide a title and select an image.");
      return;
    }
    setIsConfirmed(true);
  };

  const uploadImage = async () => {
    if (!isConfirmed) {
      alert("Please confirm before uploading.");
      return;
    }

    setLoading(true);
    let imageUrl = imagePreview;

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY);

      try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("ImgBB Response:", data);

        if (data.success) {
          imageUrl = data.data.url;
        } else {
          alert("Failed to upload image.");
          return;
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image.");
        return;
      }
    }

    const newMeme = {
      id: Date.now(),
      title,
      imageUrl,
      user: user.username,
      likes: 0,
      comments: [],
      date: new Date().toISOString(),
    };

    await addMeme(newMeme);

    setTitle("");
    setImage(null);
    setImagePreview(null);
    setSelectedTemplate(null);
    setIsConfirmed(false);

    alert("Meme uploaded successfully!");
    router.push("/profile");

    setLoading(false);
  };

  return (
    <div className="py-20 flex flex-col items-center">
      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Upload or Generate Meme
      </motion.h2>

      {user ? (
        <>
          <motion.input
            type="text"
            placeholder="Meme Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 my-2 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 my-2 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          <h3 className="text-lg font-semibold mt-4">Or Choose a Meme Template:</h3>
          <motion.div
            className="flex gap-2 overflow-x-auto p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {memeTemplates.map((template) => (
              <motion.img
                key={template.id}
                src={template.url}
                alt={template.name}
                className={`w-20 h-20 rounded-md cursor-pointer ${selectedTemplate?.id === template.id ? "border-4 border-blue-500" : ""}`}
                onClick={() => handleTemplateSelect(template)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>

          {selectedTemplate && (
            <>
              <motion.input
                type="text"
                placeholder="Top Text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className="border p-2 my-2 w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.input
                type="text"
                placeholder="Bottom Text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className="border p-2 my-2 w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.button
                onClick={generateMeme}
                className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {loading ? "Generating..." : "Generate Meme"}
              </motion.button>
            </>
          )}

          {imagePreview && (
            <motion.img
              src={imagePreview}
              alt="Meme Preview"
              className="w-64 h-auto mt-4 rounded-md shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <motion.button
            onClick={confirmUpload}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Confirm Upload
          </motion.button>

          {isConfirmed && (
            <motion.button
              onClick={uploadImage}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? "Uploading..." : "Upload Meme"}
            </motion.button>
          )}
        </>
      ) : (
        <motion.p
          className="text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Please log in to upload memes.
        </motion.p>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default UploadMeme;