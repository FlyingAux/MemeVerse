"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMeme } from "../utils/indexedDB";
import LoginModal from "../utils/LoginModal";
import { motion } from "framer-motion";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

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
        toast.info("🚀 Please log in to upload memes!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
  
     
        setTimeout(() => {
          router.push("/");
        }, 2000); 
        return;
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

  const uploadImage = async () => {
    if (!isConfirmed) {
      toast.info("Please confirm before uploading!!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
              transition: Bounce,
            });
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
        if (data.success) {
          imageUrl = data.data.url;
        } else {
          toast.error("Failed to Upload!", {
                  position: "top-right",
                  autoClose: 2000, 
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                  transition: Bounce,
                });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to Upload!", {
                position: "top-right",
                autoClose: 2000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
              });
        setLoading(false);
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
    toast.success("Meme uploaded successfully!!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
    
          
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
    setLoading(false);
    
  };

  return (
    <div className="py-24 flex flex-col items-center max-w-3xl mx-auto p-8 bg-purple-100 dark:bg-purple-400 shadow-xl rounded-xl border border-slate-200 dark:border-white">
       <ToastContainer />
      <motion.h2 className="text-3xl font-extrabold mb-6 text-purple-500 dark:text-white">Upload or Generate Meme</motion.h2>
      {user ? (
        <>
          <motion.input
            type="text"
            placeholder="Meme Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-white dark:text-black"
          />

          <motion.input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-black dark:border-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <h3 className="text-lg font-semibold mt-4">Or Choose a Meme Template:</h3>
          <motion.div className="grid grid-cols-5 gap-2 mt-3">
            {memeTemplates.map((template) => (
              <motion.img
                key={template.id}
                src={template.url}
                alt={template.name}
                className={`w-24 h-24 rounded-lg cursor-pointer border-2 ${selectedTemplate?.id === template.id ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => handleTemplateSelect(template)}
              />
            ))}
          </motion.div>
          {imagePreview && <motion.img src={imagePreview} alt="Preview" className="w-64 mt-6 rounded-lg shadow-md border border-gray-300" />}
          <motion.button onClick={() => setIsConfirmed(true)} className="px-6 py-3 bg-green-500 text-white rounded-lg mt-4 hover:bg-green-600 transition-all">Confirm</motion.button>
          <motion.button onClick={uploadImage} disabled={!isConfirmed} className={`px-6 py-3 ${isConfirmed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} text-white rounded-lg mt-6 transition-all`}>{loading ? "Uploading..." : "Upload Meme"}</motion.button>
        </>
      ) : (
        <motion.p className="text-red-500">Please log in to upload memes.</motion.p>
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default UploadMeme;
