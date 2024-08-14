"use client";
import React, { useState, useEffect } from "react";

const RatingForm = ({ setOpened }) => {
  const [rating, setRating] = useState(3);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");

  const [ratingAvg, setRatingAvg] = useState(-1);

  useEffect(() =>
  {}, []);

 

  const submitRatingData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submitRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: rating, name: name, feedback: feedback }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    setOpened();
  };


  return (
    <div>
      <div>
        Leave a rating on this AI Assistant
      </div>
      <form>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your name..."
          />
        <div>
          1 <input
            onChange={(e) => setRating(e.target.value)}
            type="radio"
            name="rVal"
            value="1"
            />
          2 <input
            onChange={(e) => setRating(e.target.value)}
            type="radio"
            name="rVal"
            value="2"
            />
          3 <input
            onChange={(e) => setRating(e.target.value)}
            type="radio"
            name="rVal"
            value="3"
            />
          4 <input
            onChange={(e) => setRating(e.target.value)}
            type="radio"
            name="rVal"
            value="4"
            />
          5 <input
            onChange={(e) => setRating(e.target.value)}
            type="radio"
            name="rVal"
            value="5"
            />
        </div>
        <input
          onChange={(e) => setFeedback(e.target.value)}
          type="text"
          placeholder="Enter your feedback..."
          maxLength={300}
          />

        <button onClick={submitRatingData} type="submit">
          Submit Rating!
        </button>
      </form>
    </div>
  );
};

export default RatingForm;