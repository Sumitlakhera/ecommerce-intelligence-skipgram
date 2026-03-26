from gensim.models import Word2Vec
from recommender.preprocess import build_corpus


def train_model():
    corpus = build_corpus("data/flipkart_products.csv")

    print("Training model...")

    model = Word2Vec(
        sentences=corpus,
        vector_size=100,
        window=5,
        min_count=2,
        workers=4,
        sg=1
    )

    model.save("recommender/word2vec.model")

    print("Model saved!")

    return model


def load_model():
    return Word2Vec.load("recommender/word2vec.model")