# E-Commerce Intelligence Skip-Gram

E-Commerce Intelligence Skip-Gram is a product discovery project that uses a Skip-Gram Word2Vec model trained on e-commerce catalog data. It helps users explore semantically related product terms, making it easier to find similar items and understand product relationships. The project combines a Flask backend for inference APIs with a React frontend for interactive search, autocomplete, and similarity visualization.

## Project Overview

This project trains and serves word embeddings from product names in the Flipkart product dataset. The backend exposes endpoints for similarity search and prefix-based suggestions, while the frontend provides a simple interface to query terms and visualize the top matches.

## Features

- Skip-Gram Word2Vec model trained on e-commerce product names
- Product-term similarity search using cosine similarity
- Prefix autocomplete for faster search input
- Interactive React dashboard with result cards and a bar chart
- Preprocessing pipeline with text cleaning, lemmatization, and bigram generation

## Tech Stack

- Backend: Flask, Flask-CORS
- ML/NLP: Gensim, Pandas, NLTK
- Frontend: React, Axios, Chart.js
- Dataset: Flipkart product catalog CSV

## Repository Structure

```text
backend/        Flask application and API routes
frontend/       React client application
recommender/    Training, preprocessing, and saved Word2Vec model
data/           Source dataset
notebooks/      Exploration notebook
test_model.py   Simple model training and similarity check
debug_corpus.py Corpus inspection helper
```

## How It Works

1. Product names are cleaned and normalized.
2. Stopwords and low-value descriptive terms are removed.
3. Lemmas and bigram tokens are generated.
4. A Skip-Gram Word2Vec model is trained on the processed corpus.
5. The backend loads the trained model and returns similar terms for a given query.

## Prerequisites

Make sure the following are available on your machine:

- Python 3.10+
- Node.js 18+ and npm
- The dataset file at `data/flipkart_products.csv`

## Backend Setup

Install Python dependencies:

```bash
pip install -r backend/requirements.txt nltk
```

Install the NLTK resources used by preprocessing:

```bash
python -m nltk.downloader stopwords wordnet omw-1.4
```

Start the Flask server from the repository root:

```bash
python backend/app.py
```

The backend runs by default at `http://127.0.0.1:5000`.

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend runs by default at `http://localhost:3000`.

## Model Training

A pretrained model already exists at `recommender/word2vec.model`. If you want to retrain it, run:

```bash
python test_model.py
```

This script builds the corpus, trains the model, saves it, and prints sample similar words.

## API Endpoints

### `GET /`

Health-check endpoint.

Example response:

```json
{
  "message": "API running 🚀"
}
```

### `GET /similar?word=<term>`

Returns the top 5 most similar terms from the trained embedding model.

Example response:

```json
{
  "input_word": "laptop",
  "similar_words": [
    { "word": "notebook", "score": 0.913 }
  ]
}
```

### `GET /suggest?prefix=<text>`

Returns up to 10 vocabulary suggestions that start with the provided prefix.

## Notes

- The backend loads the trained model once during startup for faster responses.
- The current frontend points to a locally running backend at `127.0.0.1:5000`.
- Training depends on the Flipkart CSV being present in the `data/` directory.

## Future Improvements

- Add proper automated backend and frontend tests
- Move API URLs to environment variables
- Add filters for product categories or brands
- Package model training as a separate reproducible script

## License

This repository currently does not include a license file.
