import sys
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.tokenize import word_tokenize
from nltk import pos_tag

def parse_text(text):
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)
    return tagged_tokens

if __name__ == "__main__":
    plantuml_script = sys.argv[1]
    
    parsed_text = parse_text(plantuml_script)
    print("Parsed Text:", parsed_text)