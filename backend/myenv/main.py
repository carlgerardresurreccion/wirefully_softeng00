import sys
import nltk
from nltk.tokenize import word_tokenize
from nltk import pos_tag
import json
import re

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

def parse_text(text):
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)
    return tagged_tokens

def validate_plantuml_script(text):
    if not text.startswith("@startuml") or not text.endswith("@enduml"):
        raise ValueError("The script must start with '@startuml' and end with '@enduml'.")
    
if __name__ == "__main__":
    plantuml_script = sys.argv[1]

    try:
        validate_plantuml_script(plantuml_script)
        parsed_text = parse_text(plantuml_script)
        print(json.dumps({'parsed_text': parsed_text}))
    except ValueError as e:
        print(json.dumps(str(e)), file=sys.stderr)
        sys.exit(1)


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

    distinct_usecases = []
    for usecase in usecases:
        usecase_elements = []
        usecase_elements.append({
            'type': 'usecase',
            'name': usecase[1],
            'component': 'button',  # Example UI component
            'label': usecase[0]
        })

        if usecase[1] == 'Login':
            usecase_elements.append({
                'type': 'login_function',
                'component': 'login form',  # Example UI component for login
                'label': 'Login'
            })
        elif usecase[1] == 'Register':
            usecase_elements.append({
                'type': 'register_function',
                'component': 'register form',  
                'label': 'Register'
            })

        distinct_usecases.append(usecase_elements)

    return distinct_usecases

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

from PIL import Image, ImageDraw

def generate_phone_wireframe_template(elements, image_path):
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

    for element in elements:
        if isinstance(element, dict) and 'type' in element:
            if element['type'] == 'login_function':
                draw_login_form(draw, screen_margin, screen_width, screen_height, border_width)
            elif element['type'] == 'register_function':
                draw_register_form(draw, screen_margin, screen_width, screen_height, border_width)
    
    image_path = os.path.normpath(image_path)
    img.save(image_path)
    print(f"Image saved at: {image_path}")
    return image_path

def draw_login_form(draw, screen_margin, screen_width, screen_height, border_width):
    form_width = screen_width - 40
    form_height = 200
    form_x = (screen_width - form_width) // 2
    form_y = (screen_height - form_height) // 2

    draw.rectangle([screen_margin + form_x, screen_margin + form_y,
                    screen_margin + form_x + form_width, screen_margin + form_y + form_height],
                   outline="black", width=border_width)

    title_text = "Log in to your account"
    title_font_size = 16
    try:
        title_font = ImageFont.truetype("arial.ttf", title_font_size)
    except IOError:
        title_font = ImageFont.load_default()
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = screen_margin + form_x + (form_width - title_width) // 2
    title_y = screen_margin + form_y + 10
    draw.text((title_x, title_y), title_text, fill="black", font=title_font)

    label_font_size = 14
    try:
        label_font = ImageFont.truetype("arial.ttf", label_font_size)
    except IOError:
        label_font = ImageFont.load_default()
    username_label = "Username:"
    password_label = "Password:"
    username_bbox = draw.textbbox((0, 0), username_label, font=label_font)
    password_bbox = draw.textbbox((0, 0), password_label, font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 30), username_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 60), password_label, fill="black", font=label_font)

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

    button_width = 80
    button_height = 30
    button_x = (screen_width - button_width) // 2
    button_y = form_y + form_height - button_height - 20
    draw.rectangle([screen_margin + button_x, screen_margin + button_y,
                    screen_margin + button_x + button_width, screen_margin + button_y + button_height],
                   fill="black")
    button_text = "Log In"
    button_font_size = 14
    try:
        button_font = ImageFont.truetype("arial.ttf", button_font_size)
    except IOError:
        button_font = ImageFont.load_default()
    button_bbox = draw.textbbox((0, 0), button_text, font=button_font)
    button_text_width = button_bbox[2] - button_bbox[0]
    button_text_height = button_bbox[3] - button_bbox[1]
    button_text_x = screen_margin + button_x + (button_width - button_text_width) // 2
    button_text_y = screen_margin + button_y + (button_height - button_text_height) // 2
    draw.text((button_text_x, button_text_y), button_text, fill="white", font=button_font)

def draw_register_form(draw, screen_margin, screen_width, screen_height, border_width):
    form_width = screen_width - 40
    form_height = 200
    form_x = (screen_width - form_width) // 2
    form_y = (screen_height - form_height) // 2

    draw.rectangle([screen_margin + form_x, screen_margin + form_y,
                    screen_margin + form_x + form_width, screen_margin + form_y + form_height],
                   outline="black", width=border_width)

    title_text = "Register your account"
    title_font_size = 16
    try:
        title_font = ImageFont.truetype("arial.ttf", title_font_size)
    except IOError:
        title_font = ImageFont.load_default()
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = screen_margin + form_x + (form_width - title_width) // 2
    title_y = screen_margin + form_y + 10
    draw.text((title_x, title_y), title_text, fill="black", font=title_font)

    label_font_size = 14
    try:
        label_font = ImageFont.truetype("arial.ttf", label_font_size)
    except IOError:
        label_font = ImageFont.load_default()
    username_label = "Username:"
    email_label = "Email:"
    password_label = "Password:"
    confirm_password_label = "Confirm Password:"
    username_bbox = draw.textbbox((0, 0), username_label, font=label_font)
    email_bbox = draw.textbbox((0, 0), email_label, font=label_font)
    password_bbox = draw.textbbox((0, 0), password_label, font=label_font)
    confirm_password_bbox = draw.textbbox((0, 0), confirm_password_label, font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 30), username_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 60), email_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 90), password_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, title_y + title_height + 120), confirm_password_label, fill="black", font=label_font)

    field_width = form_width - 20
    field_height = 20
    username_field_y = title_y + title_height + 45
    email_field_y = title_y + title_height + 75
    password_field_y = title_y + title_height + 105
    confirm_password_field_y = title_y + title_height + 135
    draw.rectangle([screen_margin + form_x + 10, username_field_y,
                    screen_margin + form_x + 10 + field_width, username_field_y + field_height],
                   outline="black", width=border_width)
    draw.rectangle([screen_margin + form_x + 10, email_field_y,
                    screen_margin + form_x + 10 + field_width, email_field_y + field_height],
                   outline="black", width=border_width)
    draw.rectangle([screen_margin + form_x + 10, password_field_y,
                    screen_margin + form_x + 10 + field_width, password_field_y + field_height],
                   outline="black", width=border_width)
    draw.rectangle([screen_margin + form_x + 10, confirm_password_field_y,
                    screen_margin + form_x + 10 + field_width, confirm_password_field_y + field_height],
                   outline="black", width=border_width)

    button_width = 80
    button_height = 30
    button_x = (screen_width - button_width) // 2
    button_y = form_y + form_height - button_height - 20
    draw.rectangle([screen_margin + button_x, screen_margin + button_y,
                    screen_margin + button_x + button_width, screen_margin + button_y + button_height],
                   fill="black")
    button_text = "Register"
    button_font_size = 14
    try:
        button_font = ImageFont.truetype("arial.ttf", button_font_size)
    except IOError:
        button_font = ImageFont.load_default()
    button_bbox = draw.textbbox((0, 0), button_text, font=button_font)
    button_text_width = button_bbox[2] - button_bbox[0]
    button_text_height = button_bbox[3] - button_bbox[1]
    button_text_x = screen_margin + button_x + (button_width - button_text_width) // 2
    button_text_y = screen_margin + button_y + (button_height - button_text_height) // 2
    draw.text((button_text_x, button_text_y), button_text, fill="white", font=button_font)

import os 
import sys

import os
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python nlp_processing.py <plantuml_script>")
        sys.exit(1)
    
    plantuml_script = sys.argv[1]
    output_dir = 'C:/wirefully_softeng/backend/myenv/generated_images'
    
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
    wireframe_elements_list = map_to_wireframe_elements(actors, usecases, relationships)
    print("Wireframe Elements:", wireframe_elements_list)

    # Generate wireframe templates and save the images
    image_paths = []
    for idx, elements in enumerate(wireframe_elements_list):
        image_filename = f'phone_wireframe_template_{idx + 1}.png'
        image_path = os.path.join(output_dir, image_filename)
        generated_image_path = generate_phone_wireframe_template(elements, image_path)
        image_paths.append(generated_image_path)
    
    # Print and return the image paths
    print("Image Paths:", image_paths)
    relative_image_paths = [os.path.relpath(path, output_dir) for path in image_paths]
    print("Relative Image Paths:", relative_image_paths)

    return image_paths, relative_image_paths

if __name__ == "__main__":
    main()

