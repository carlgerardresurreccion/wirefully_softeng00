import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.tokenize import word_tokenize
from nltk import pos_tag

def parse_text(text):
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)
    return tagged_tokens

# Example PlantUML use case diagram script
plantuml_script = """
@startuml
actor User
usecase "Login" as UC1
usecase "Register" as UC2
User --> UC1 : Initiates
User --> UC2 : Initiates
@enduml
"""

parsed_text = parse_text(plantuml_script)
print("Parsed Text:", parsed_text)