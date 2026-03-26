from recommender.model import train_model

model = train_model()

word = "laptop"

if word in model.wv:
    similar = model.wv.most_similar(word, topn=5)
    print(f"\nTop words similar to '{word}':\n")

    for w, score in similar:
        print(w, round(score, 3))
else:
    print("Word not found")