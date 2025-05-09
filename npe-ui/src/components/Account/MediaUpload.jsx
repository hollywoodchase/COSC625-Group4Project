import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function MediaUpload() {
  const { userId } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [zoomedMedia, setZoomedMedia] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchGallery = async () => {
    if (!userId) return;
    try {
      const url = `${apiUrl}/api/gallery?userId=${userId}&filter=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Couldn’t load gallery");
      setGallery(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [userId, filter]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreviewUrl(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("userId", userId);
    fd.append("folder", "gallery");

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPreviewUrl(data.url);
      fetchGallery();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleMediaClick = (url) => {
    setZoomedMedia(url);
  };

  const closeModal = () => {
    setZoomedMedia(null);
  };

  if (!userId) {
    return <p className="text-center text-red-600">Log in to see and upload your media.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Media Gallery</h2>

      <div className="flex justify-between mb-4">
        <select onChange={handleFilterChange} value={filter} className="border px-4 py-2">
          <option value="all">All Media</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
        <input
          type="file"
          id="upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="upload" className="cursor-pointer">
          Select a photo or video
        </label>
        {selectedFile && (
          <p className="mt-4 text-green-700">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {previewUrl && (
        <div className="mt-6 text-center">
          <p className="mb-4 font-medium">Just uploaded:</p>
          {selectedFile.type.startsWith("video") ? (
            <video controls className="max-w-full rounded shadow">
              <source src={previewUrl} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={previewUrl}
              alt="Uploaded media"
              className="inline-block max-w-full rounded shadow"
            />
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((url) => (
          <div key={url} className="border rounded overflow-hidden">
            {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={url}
                alt="User upload"
                className="object-cover w-full h-40 cursor-pointer"
                onClick={() => handleMediaClick(url)}
              />
            ) : (
              <video
                className="object-cover w-full h-40 cursor-pointer"
                onClick={() => handleMediaClick(url)}
                controls
              >
                <source src={url} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 text-white text-xl"
            >
              X
            </button>
            {zoomedMedia.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={zoomedMedia}
                alt="Zoomed"
                className="max-w-full max-h-screen object-contain"
              />
            ) : (
              <video controls className="max-w-full max-h-screen object-contain">
                <source src={zoomedMedia} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
