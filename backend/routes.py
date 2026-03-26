from flask import Blueprint, request, jsonify
from recommender.model import load_model

main = Blueprint("main", __name__)

# Load model once at startup
model = load_model()


@main.route("/")
def home():
    return jsonify({"message": "API running 🚀"})


@main.route("/similar", methods=["GET"])
def get_similar_words():
    word = request.args.get("word")

    if not word:
        return jsonify({"error": "Please provide a word"}), 400

    word = word.lower()

    # check if word exists
    if word not in model.wv:
        return jsonify({"error": f"'{word}' not found in vocabulary"}), 404

    # get similar words (cosine similarity internally)
    similar_words = model.wv.most_similar(word, topn=5)

    results = [
        {"word": w, "score": round(score, 3)}
        for w, score in similar_words
    ]

    return jsonify({
        "input_word": word,
        "similar_words": results
    })

@main.route("/suggest", methods=["GET"])
def suggest_words():
    prefix = request.args.get("prefix", "").lower()

    if not prefix:
        return jsonify([])

    suggestions = [
        word for word in model.wv.index_to_key
        if word.startswith(prefix)
    ][:10]

    return jsonify(suggestions)