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
  const [loading, setLoading] = useState(false);

  const fetchSimilarWords = async () => {
    if (!word.trim()) {
      alert("Please enter a word");
      return;
    }

    setLoading(true);

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
    }

    setLoading(false);
  };

  const data = {
    labels: results.map((item) => item.word),
    datasets: [
      {
        label: "Similarity Score",
        data: results.map((item) => item.score),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div style={{
      padding: "40px",
      fontFamily: "Arial",
      textAlign: "center"
    }}>
      <h1>E-Commerce Intelligence 🔍</h1>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ maxWidth: "600px", margin: "auto" }}>
          This system uses Skip-Gram Word2Vec embeddings trained on e-commerce data
          to find semantically similar products using cosine similarity.
        </p>
        <input
          type="text"
          placeholder="Try: laptop, shoes, phone"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px"
          }}
        />

        <button
          onClick={fetchSimilarWords}
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <>
          <h3>Top Similar Words</h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {results.map((item, index) => (
              <li key={index} style={{ margin: "5px 0" }}>
                {item.word} — {item.score}
              </li>
            ))}
          </ul>

          <div style={{ width: "500px", margin: "30px auto" }}>
            <Bar data={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
