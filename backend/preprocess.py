import pandas as pd
import re

def clean_text(text):
    if pd.isna(text):
        return ""

    text = str(text).lower()

    # remove special characters
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)

    # remove extra spaces
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def build_corpus(csv_path):
    df = pd.read_csv(csv_path)

    corpus = []

    for _, row in df.iterrows():
        text_parts = []

        # product name
        text_parts.append(clean_text(row.get("product_name", "")))

        # brand
        text_parts.append(clean_text(row.get("brand", "")))

        # category
        text_parts.append(clean_text(row.get("product_category_tree", "")))

        # description
        text_parts.append(clean_text(row.get("description", "")))

        # combine all
        combined_text = " ".join(text_parts)

        # tokenize
        tokens = combined_text.split()

        if len(tokens) > 2:  # ignore very small entries
            corpus.append(tokens)

    return corpus