import sys
import nltk
import re

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.tokenize import word_tokenize
from nltk import pos_tag

def parse_text(text):
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)
    return tagged_tokens

def validate_plantuml_script(text):
    if not text.startswith("@startuml") or not text.endswith("@enduml"):
        raise ValueError("Error: The text must start with '@startuml' and end with '@enduml'.")

#if __name__ == "__main__":
#    plantuml_script = sys.argv[1]

    # Validate the PlantUML script
#    try:
#        validate_plantuml_script(plantuml_script)
#    except ValueError as e:
#        print(e)
#        sys.exit(1)
    
#    parsed_text = parse_text(plantuml_script)
#    print("Parsed Text:", parsed_text)


def syntax_analysis(script):
    actor_pattern = r'actor\s+(\w+)'
    usecase_pattern = r'usecase\s+"(.*?)"\s+as\s+(\w+)'
    relationship_pattern = r'(\w+)\s+-->\s+(\w+)\s*:\s*(.*)'

    actors = re.findall(actor_pattern, script)
    usecases = re.findall(usecase_pattern, script)
    relationships = re.findall(relationship_pattern, script)

    return actors, usecases, relationships

plantuml_script = sys.argv[1]
actors, usecases, relationships = syntax_analysis(plantuml_script)
print("Actors:", actors)
print("Use Cases:", usecases)
print("Relationships:", relationships)


def map_to_wireframe_elements(actors, usecases, relationships):
    wireframe_elements = []

    for actor in actors:
        wireframe_elements.append({
            'type': 'actor',
            'name': actor,
            'component': 'user icon'  # Example UI component
        })

    # Mapping use cases to UI components
    for usecase in usecases:
        wireframe_elements.append({
            'type': 'usecase',
            'name': usecase[1],
            'component': 'button',  # Example UI component
            'label': usecase[0]
        })

    # Check for the "Login" use case
    login_usecase = next((usecase for usecase in usecases if usecase[1] == 'Login'), None)
    if login_usecase:
        wireframe_elements.append({
            'type': 'login_function',
            'component': 'login form',  # Example UI component for login
            'label': 'Login'
        })

    # Mapping relationships to UI connectors
    for relationship in relationships:
        wireframe_elements.append({
            'type': 'relationship',
            'from': relationship[0],
            'to': relationship[1],
            'label': relationship[2],
            'component': 'line'  # Example UI component for relationships
        })

    return wireframe_elements

wireframe_elements = map_to_wireframe_elements(actors, usecases, relationships)
print("Wireframe Elements:", wireframe_elements)

from PIL import Image, ImageDraw, ImageFont

def round_corner(radius, fill):
    size = (radius * 2, radius * 2)
    corner = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(corner)
    draw.pieslice([0, 0, radius * 2, radius * 2], 180, 270, fill=fill)
    return corner

def phone_template(size, radius, fill, border_color, border_width):
    """Draw a rounded rectangle with a border to look like a phone wireframe."""
    width, height = size
    rectangle = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    corner = round_corner(radius, fill)
    
    # Paste corners
    rectangle.paste(corner, (0, 0))
    rectangle.paste(corner.rotate(90), (0, height - radius))
    rectangle.paste(corner.rotate(180), (width - radius, height - radius))
    rectangle.paste(corner.rotate(270), (width - radius, 0))
    
    draw = ImageDraw.Draw(rectangle)
    
    # edges
    draw.rectangle([radius, 0, width - radius, border_width], fill=border_color)  # Top edge
    draw.rectangle([radius, height - border_width, width - radius, height], fill=border_color)  # Bottom edge
    draw.rectangle([0, radius, border_width, height - radius], fill=border_color)  # Left edge
    draw.rectangle([width - border_width, radius, width, height - radius], fill=border_color)  # Right edge
    
    # arcs for rounded corners
    draw.arc([(0, 0), (radius * 2, radius * 2)], 180, 270, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, 0), (width, radius * 2)], 270, 360, fill=border_color, width=border_width)
    draw.arc([(0, height - radius * 2), (radius * 2, height)], 90, 180, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, height - radius * 2), (width, height)], 0, 90, fill=border_color, width=border_width)
    
    # screen area centered horizontally and with equal spaces above and below
    screen_margin = 20
    screen_width = width - 5 * screen_margin
    screen_height = height - 100 - 2 * screen_margin
    
    # Calculate equal spaces above and below the screen area
    total_vertical_space = height - 100 - screen_height
    top_space = total_vertical_space // 2
    bottom_space = total_vertical_space - top_space
    
    screen = [screen_margin, top_space + screen_margin, width - screen_margin, top_space + screen_margin + screen_height]
    draw.rectangle(screen, outline=border_color, width=border_width)
    
    # top speaker
    speaker_width = 50
    speaker_height = 10
    speaker = [(width - speaker_width) // 2, screen[1] // 2 - speaker_height // 2,
               (width + speaker_width) // 2, screen[1] // 2 + speaker_height // 2]
    draw.rectangle(speaker, fill=border_color)
    
    # home button moved higher
    button_radius = 30
    button_center = (width // 2, height - screen_margin - button_radius - 10)  # Moved up by 10 units
    draw.ellipse([(button_center[0] - button_radius, button_center[1] - button_radius),
                  (button_center[0] + button_radius, button_center[1] + button_radius)],
                 outline=border_color, width=border_width)

    return rectangle

def generate_phone_wireframe_template(elements):
    img_width = 400
    img_height = 800
    screen_margin = 20
    border_radius = 20
    border_width = 3
    screen_width = img_width - 2 * screen_margin
    screen_height = img_height - 2 * screen_margin

    img = Image.new('RGB', (img_width, img_height), 'white')
    draw = ImageDraw.Draw(img)

    phone_screen = phone_template((screen_width, screen_height), border_radius, "white", "black", border_width)
    img.paste(phone_screen, (screen_margin, screen_margin), phone_screen)

    # Draw UI components
    for element in elements:
        if element['type'] == 'login_function':
            draw_login_form(draw, screen_margin, screen_width, screen_height, border_width)

    img.show()
    img.save('phone_wireframe_template.png')

def draw_login_form(draw, screen_margin, screen_width, screen_height, border_width):
    form_width = screen_width - 40
    form_height = 200
    form_x = (screen_width - form_width) // 2
    form_y = (screen_height - form_height) // 2

    # Draw login form rectangle
    draw.rectangle([screen_margin + form_x, screen_margin + form_y,
                    screen_margin + form_x + form_width, screen_margin + form_y + form_height],
                   outline="black", width=border_width)

    # Draw title text
    title_text = "Log in to your account"
    title_font_size = 16
    title_font = ImageFont.truetype("arial.ttf", title_font_size)  # Adjust the font path if needed
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = screen_margin + form_x + (form_width - title_width) // 2
    title_y = screen_margin + form_y + 10  # Add padding from top
    draw.text((title_x, title_y), title_text, fill="black", font=title_font)

    # Draw text fields labels
    label_font_size = 14
    label_font = ImageFont.truetype("arial.ttf", label_font_size)  # Adjust the font path if needed
    username_label = "Username:"
    password_label = "Password:"
    username_bbox = draw.textbbox((0, 0), username_label, font=label_font)
    password_bbox = draw.textbbox((0, 0), password_label, font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 30), username_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 60), password_label, fill="black", font=label_font)

    # Draw text fields rectangles
    field_width = form_width - 20
    field_height = 20
    username_field_y = title_y + title_height + 45
    password_field_y = title_y + title_height + 75
    draw.rectangle([screen_margin + form_x + 10, username_field_y,
                    screen_margin + form_x + 10 + field_width, username_field_y + field_height],
                   outline="black", width=border_width)
    draw.rectangle([screen_margin + form_x + 10, password_field_y,
                    screen_margin + form_x + 10 + field_width, password_field_y + field_height],
                   outline="black", width=border_width)

    # Draw login button
    button_width = 80
    button_height = 30
    button_x = (screen_width - button_width) // 2
    button_y = form_y + form_height - button_height - 20
    draw.rectangle([screen_margin + button_x, screen_margin + button_y,
                    screen_margin + button_x + button_width, screen_margin + button_y + button_height],
                   fill="black")
    button_text = "Log In"
    button_font_size = 14
    button_font = ImageFont.truetype("arial.ttf", button_font_size)  # Adjust the font path if needed
    button_bbox = draw.textbbox((0, 0), button_text, font=button_font)
    button_text_width = button_bbox[2] - button_bbox[0]
    button_text_height = button_bbox[3] - button_bbox[1]
    button_text_x = screen_margin + button_x + (button_width - button_text_width) // 2
    button_text_y = screen_margin + button_y + (button_height - button_text_height) // 2
    draw.text((button_text_x, button_text_y), button_text, fill="white", font=button_font)


if __name__ == "__main__":
    plantuml_script = sys.argv[1]

    # Validate the PlantUML script
    try:
        validate_plantuml_script(plantuml_script)
    except ValueError as e:
        print(e)
        sys.exit(1)
    
    parsed_text = parse_text(plantuml_script)
    print("Parsed Text:", parsed_text)

    # Perform syntax analysis
    actors, usecases, relationships = syntax_analysis(plantuml_script)
    print("Actors:", actors)
    print("Use Cases:", usecases)
    print("Relationships:", relationships)

    # Map to wireframe elements
    wireframe_elements = map_to_wireframe_elements(actors, usecases, relationships)
    print("Wireframe Elements:", wireframe_elements)

    # Generate wireframe template
    generate_phone_wireframe_template(wireframe_elements)