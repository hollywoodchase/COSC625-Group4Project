import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Importing useAuth to access user authentication context
import axios from 'axios';

const ParkCard = ({ park }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();  // Accessing userId from AuthContext
  const [isLiked, setIsLiked] = useState(false);  // State to track if the park is liked by the user

  const imageUrl = park.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image';
  const description = park.description || "No description available.";

  const path = process.env.REACT_APP_API_URL;
    // Fetch liked parks when component mounts
  useEffect(() => {
    if (userId) {
      axios
        //.get(`${process.env.REACT_APP_API_URL}/liked-parks/${userId}`) -----uncomment once this code is on Render. 
        .get(`${path}/liked-parks/${userId}`)
        .then((response) => {
          console.log(response.data)
          const likedParks = response.data;
          const isParkLiked = likedParks.some((likedPark) => likedPark.liked_park === park.parkCode);
          setIsLiked(isParkLiked);
        })
        
        .catch((error) => {
          console.error("Error fetching liked parks-front:", error);
        });
    }
  }, [userId, park.parkCode]);

  const handleLike = () => {
    if (!userId) {
      alert('Please log in to like parks');
      return;
    }
  
    if (isLiked) {
      // Unlike the park
      axios
        .delete(`${path}/liked-parks`, { data: { userId, parkName: park.parkCode } })
        // add the render specific path later. Uncomment the below to set it to Render
        // .delete(`${process.env.REACT_APP_API_URL}/liked-parks`, { data: { userId, parkName: park.parkCode } }) ----UNCOMMENT
        .then(() => {
          setIsLiked(false);
        })
        .catch((error) => {
          console.error("Error unliking park-front:", error);
        });
    } else {
      // Like the park
      axios
        //.post(`${process.env.REACT_APP_API_URL}/liked-parks`, { userId, parkName: park.fullName }) ----UNCOMMENT once Render has new Backend CODE.
        .post(`${path}/liked-parks`, { userId, parkName: park.parkCode })
        .then(() => {
          setIsLiked(true);
        })
        .catch((error) => {
          console.error("Error liking park-front:", error);
        });
    }
  };


  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 hover:-translate-y-1 transition-transform cursor-pointer"
      onClick={() => navigate(`/COSC625-Group4Project/parks/${park.parkCode}`)}
    >
      <img
        src={imageUrl}
        alt={park.fullName}
        className="w-full h-40 object-cover rounded-lg mb-2"
      />
      <h4 className="font-semibold text-lg">{park.fullName}</h4>
      <p className="text-sm text-gray-600">
        <strong>{park.addresses[0]?.city}, {park.states}</strong>
      </p>
      <p className="text-sm mt-1">{description}</p>



      {/* Adding the Heart button to like/unlike here */}
      <button
        onClick={handleLike}
        className={`absolute top-2 right-2 p-2 rounded-full text-2xl text-red-700 ${
          isLiked ? 'text-red-700' : 'text-gray-700'
        }`}
        title={isLiked ? 'Unlike' : 'Like'}
      >
       {isLiked ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default ParkCard;