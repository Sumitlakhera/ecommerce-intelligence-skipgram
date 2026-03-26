from recommender.preprocess import build_corpus

corpus = build_corpus("data/flipkart_products.csv")

print("Total sentences:", len(corpus))

print("\n🔹 Sample Sentences:\n")

for i in range(10):
    print(corpus[i])