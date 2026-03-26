from collections import Counter

import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


stop_words = set(stopwords.words("english"))
CUSTOM_STOPWORDS = {
    "solid", "super", "nice", "new", "latest",
    "fashion", "style", "casual", "corporate",
    "design", "designer", "quality"
}
lemmatizer = WordNetLemmatizer()


def is_valid_word(word):
    # remove weird tokens
    if any(char.isdigit() for char in word):
        return False
    if len(word) < 3:
        return False
    return True


def clean_text(text):
    if pd.isna(text):
        return ""

    text = str(text).lower()

    # remove non-alphabet
    text = re.sub(r'[^a-z\s]', ' ', text)

    tokens = text.split()

    # remove stopwords + lemmatize
    tokens = [
    lemmatizer.lemmatize(word)
    for word in tokens
    if word not in stop_words
    and word not in CUSTOM_STOPWORDS
    and is_valid_word(word)
    ]
    # create bigrams
    bigrams = [
    tokens[i] + "_" + tokens[i+1]
    for i in range(len(tokens)-1)
    if tokens[i] != tokens[i+1]   # avoid duplicates
]
    tokens.extend(bigrams)

    return " ".join(tokens)



def build_corpus(csv_path):
    df = pd.read_csv(csv_path)

    raw_corpus = []

    # Step 1: Build raw corpus
    for _, row in df.iterrows():
        name = clean_text(row.get("product_name", ""))
        tokens = name.split()

        if len(tokens) > 2:
            raw_corpus.append(tokens)

    # Step 2: Compute frequency
    from collections import Counter

    all_words = [word for sentence in raw_corpus for word in sentence]
    word_freq = Counter(all_words)

    MIN_FREQ = 15  

    # Step 3: Filter corpus
    final_corpus = []

    for sentence in raw_corpus:
        filtered = [w for w in sentence if word_freq[w] >= MIN_FREQ]

        if len(filtered) > 2:  
            final_corpus.append(filtered)

    return final_corpus