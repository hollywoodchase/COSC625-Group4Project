import React, { useState, useEffect } from "react";

export default function VisitHistory() {
  const [visitHistory, setVisitHistory] = useState([]);
  const [error, setError] = useState(null);
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  // API key for the parks API (non-sensitive)
  const apiKey = "wT7qTdbCiApVc0O9U4sDpW0AEFgcfmyB8fHNW42O";


  const userId = localStorage.getItem("userId");
  // Fetch visit history from the backend
  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/visit-history?user_id=${userId}`, 
        );
        if (response.ok) {
          const data = await response.json();
          // Map the data to include only park name and visit date
          const formattedData = data.map((visit) => ({
            park: visit.park_name, // Assuming the backend returns 'park_name'
            date: visit.visit_date.split("T")[0], // Remove the time part from the date
          }));
          setVisitHistory(formattedData);
        } else {
          console.error("Failed to fetch visit history");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load visit history.");
      }
    };

    fetchVisitHistory();
  }, [userId]);

  // Fetch all parks from the API
  useEffect(() => {
    const fetchAllParks = async () => {
      let allParks = [];
      let start = 0;
      const limit = 50;
      let total = 0;

      try {
        do {
          const res = await fetch(
            `https://developer.nps.gov/api/v1/parks?limit=${limit}&start=${start}&api_key=${apiKey}`
          );
          const data = await res.json();
          total = parseInt(data.total);
          allParks = [...allParks, ...data.data];
          start += limit;
        } while (allParks.length < total);

        setParks(allParks);
      } catch (err) {
        console.error("Error fetching parks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllParks();
  }, []);

  // Handle form submission to add a new visited park
  const handleAddVisit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newVisit = {
      user_id: userId, 
      park: formData.get("park"),
      date: formData.get("date"),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/visit-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVisit),
      });

      if (response.ok) {
        const savedVisit = await response.json();
        setVisitHistory((prevHistory) => [...prevHistory, savedVisit]);
        e.target.reset();
      } else {
        console.error("Failed to add visit");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Visit History</h2>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {visitHistory.length > 0 ? (
          visitHistory.map((entry, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{entry.park}</h3>
              <p className="text-sm text-gray-500">Visited on {entry.date}</p>
            </li>
          ))
        ) : (
          <p>No visit history available.</p>
        )}
      </ul>

      <form onSubmit={handleAddVisit} className="mt-6 border rounded-lg p-4 bg-gray-100">
        <h4 className="text-lg font-semibold mb-2">Add a Visited Park</h4>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="park">
            Park Name
          </label>
          <select
            id="park"
            name="park"
            required
            className="w-full border rounded px-2 py-1"
            disabled={loading}
            defaultValue="" 

          >
            <option value="" disabled selected>
              {loading ? "Loading parks..." : "Select a park"}
            </option>
            {parks.map((park) => (
              <option key={park.id} value={park.fullName}>
                {park.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1" htmlFor="date">
            Date of Visit
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Add Visit
        </button>
      </form>
    </div>
  );
}
