import React, { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const wrapperRef = useRef(null);

  // Fetch similar words
  const fetchSimilarWords = async () => {
    if (!word.trim()) {
      alert("Enter a word");
      return;
    }

    setLoading(true);
    setSuggestions([]); // clear dropdown

    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/similar?word=${word}`
      );
      setResults(res.data.similar_words);
    } catch (err) {
      alert("Error fetching results");
    }

    setLoading(false);
  };

  //Fetch suggestions
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/suggest?prefix=${value}`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.log("Suggestion error");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Chart Data
  const data = {
    labels: results.map((item) => item.word),
    datasets: [
      {
        label: "Similarity Score",
        data: results.map((item) => item.score),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        size: 100,
      },
    ],
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        E-Commerce Intelligence 🔍
      </h1>

      <p style={{ maxWidth: "600px", margin: "auto", paddingBottom: "20px" }}>
        This system uses Skip-Gram Word2Vec embeddings trained on e-commerce data
        to find semantically similar products using cosine similarity.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
        }}
      >
        <div
          ref={wrapperRef}
          style={{
            position: "relative",
            width: "300px",
          }}
        >
          <input
            type="text"
            placeholder="Search (e.g. shoe, laptop, deodorant, jacket)"
            value={word}
            onChange={(e) => {
              const value = e.target.value;
              setWord(value);
              fetchSuggestions(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchSimilarWords();
              }
            }}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: suggestions.length > 0 ? "8px 8px 0 0" : "8px",
              border: "1px solid #ccc",
              borderBottom:
                suggestions.length > 0 ? "none" : "1px solid #ccc",
            }}
          />

          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                width: "108%",
                background: "#ffffff",
                border: "1px solid #02adc3",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setWord(s);
                    setSuggestions([]);
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "#fff")
                  }
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={fetchSimilarWords}
          style={{
            padding: "12px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            height: "37px",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>Top Similar Words</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {results.map((item, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: "#668ece",
                  padding: "15px",
                  margin: "10px",
                  borderRadius: "10px",
                  width: "150px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",

                  transform: hoveredIndex === index ? "translateY(-8px) scale(1.03)" : "translateY(0)",
                  boxShadow:
                    hoveredIndex === index
                      ? "0 12px 24px rgba(0,0,0,0.25)"
                      : "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h4>{item.word}</h4>
                <p>{item.score}</p>
              </div>
            ))}
          </div>

          <div style={{ width: "500px", margin: "30px auto" }}>
            <Bar data={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;