import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState([]);

  const fetchSimilarWords = async () => {
    if (!word.trim()) {
      alert("Please enter a word");
      return;
    }
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/similar?word=${word}`
      );
      setResults(res.data.similar_words);
    } catch (err) {
      if (err.response && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Server error. Please try again.");
      }
      console.error(err);
    }
  };

  const data = {
    labels: results.map((item) => item.word),
    datasets: [
      {
        label: "Similarity Score",
        data: results.map((item) => item.score),
      },
    ],
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>E-Commerce Intelligence 🔍</h2>

      <input
        type="text"
        placeholder="Try: laptop, shoes, phone"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <button onClick={fetchSimilarWords}>Search</button>

      <ul>
        {results.map((item, index) => (
          <li key={index}>
            {item.word} — {item.score}
          </li>
        ))}
      </ul>

      {results.length > 0 && <Bar data={data} />}
    </div>
  );
}

export default App;
