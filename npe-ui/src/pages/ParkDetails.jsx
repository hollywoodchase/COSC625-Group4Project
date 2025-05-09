import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Tabs from '../components/Tabs';
import { fetchParkDetails, fetchWebcamData } from '../services/npsApi';

const ParkDetails = () => {
  const { parkCode } = useParams();
  const [park, setPark] = useState(null);
  const [webcams, setWebcams] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const parkData = await fetchParkDetails(parkCode);
        const webcamData = await fetchWebcamData(parkCode);
        // Fetch reviews from the backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews?parkCode=${parkCode}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const reviewsData = await response.json();
        const formattedReviews = reviewsData.map((review) => ({
          id: review.review_id,
          author: review.name,
          content: review.review,
          rating: review.star_rating,
        }));
        setReviews(formattedReviews);
        setPark(parkData);
        setWebcams(webcamData);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [parkCode]);

  if (!park) return <div className="p-6">Loading...</div>;

  const { fullName, description, weatherInfo, directionsInfo, directionsUrl, images, addresses, contacts } = park;
  const address = addresses?.[0] || {};
  const phone = contacts?.phoneNumbers?.[0]?.phoneNumber || 'N/A';
  const email = contacts?.emailAddresses?.[0]?.emailAddress || 'N/A';

  const webcamContent = webcams.length > 0 ? (
    webcams.map((webcam) => (
      <div key={webcam.id} className="border rounded-lg p-4 bg-gray-100 mt-4">
        <h4 className="text-lg font-semibold">{webcam.title}</h4>
        <p>{webcam.description}</p>
        {webcam.url && (
          <a
            href={webcam.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline block mt-2"
          >
            View Live Webcam
          </a>
        )}
      </div>
    ))
  ) : (
    <p className="mt-2">No webcams available for this park.</p>
  );

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newReview = {
      name: formData.get("name"),
      review: formData.get("review"),
      star_rating: formData.get("rating"),
      parkCode: parkCode,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const savedReview = await response.json();
        setReviews((prevReviews) => [
          ...prevReviews,
          {
            id: savedReview.review_id,
            author: savedReview.name,
            content: savedReview.review,
            rating: savedReview.star_rating,
          },
        ]);
        e.target.reset();
      } else {
        console.error("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reviewForm = (
    <form onSubmit={handleReviewSubmit} className="mt-4 border rounded-lg p-4 bg-gray-100">
      <h4 className="text-lg font-semibold mb-2">Add a Review</h4>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="rating">
          Rating (1-5)
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="1"
          max="5"
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1" htmlFor="review">
          Review
        </label>
        <textarea
          id="review"
          name="review"
          rows="4"
          required
          className="w-full border rounded px-2 py-1"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
      >
        Submit Review
      </button>
    </form>
  );



  
  const reviewsContent = reviews.length > 0 ? (
    reviews.map((review) => (
      <div key={review.id} className="border rounded-lg p-4 bg-gray-100 mt-4">
        <h4 className="text-lg font-semibold">{review.author}</h4>
        <p>Rating: {review.rating} / 5</p>
        <p className='mt-1'>{review.content}</p>
      </div>
    ))
  ) : (
    <p className="mt-2">No reviews available for this park.</p>
  );



  




  return (
    <div>
      <HeroSection title={fullName} backButton />

      <main className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg -mt-20 relative z-10">
        <p className="font-semibold mb-2">
          {address.line1}, {address.city}, {address.stateCode} &nbsp;|&nbsp;
          Phone: {phone} &nbsp;|&nbsp; Email: {email}
        </p>

        <div className="flex flex-wrap gap-4 my-4">
          {images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.altText}
              className="h-48 rounded-lg object-cover"
            />
          ))}
        </div>

        <Tabs
          tabs={{
            Overview: <p>{description}</p>,
            Weather: <p>{weatherInfo}</p>,
            Webcam: <div>{webcamContent}</div>,
            Reviews: (
              <div>
                {reviewForm}
                {reviewsContent}
              </div>
            ),
            "Visitor Count": <p>Visitor data not available.</p>,
            Map: (
              <div>
                <p>{directionsInfo}</p>
                <p>
                  <a
                    href={directionsUrl}
                    className="text-green-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Plan Your Visit
                  </a>
                </p>
              </div>
            ),
          }}
        />
      </main>

      <footer className="text-center py-4 bg-gray-100 text-sm mt-8">
        &copy; 2025 National Park Explorer
      </footer>
    </div>
  );
};

export default ParkDetails;
