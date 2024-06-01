import re
from nlp_processing import plantuml_script

def syntax_analysis(script):
    actor_pattern = r'actor\s+(\w+)'
    usecase_pattern = r'usecase\s+"(.*?)"\s+as\s+(\w+)'
    relationship_pattern = r'(\w+)\s+-->\s+(\w+)\s*:\s*(.*)'

    actors = re.findall(actor_pattern, script)
    usecases = re.findall(usecase_pattern, script)
    relationships = re.findall(relationship_pattern, script)

    return actors, usecases, relationships

actors, usecases, relationships = syntax_analysis(plantuml_script)
print("Actors:", actors)
print("Use Cases:", usecases)
print("Relationships:", relationships)