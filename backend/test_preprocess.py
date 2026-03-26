from app.preprocess import build_corpus

corpus = build_corpus("../data/flipkart_products.csv")

print("Total sentences:", len(corpus))
print("Sample sentence:", corpus[0])