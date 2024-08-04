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

def map_to_wireframe_elements(actors, usecases, relationships):
    wireframe_elements = []

    for actor in actors:
        wireframe_elements.append({
            'type': 'actor',
            'name': actor,
            'component': 'user icon' 
        })

    distinct_usecases = []
    for usecase in usecases:
        usecase_elements = []
        usecase_elements.append({
            'type': 'usecase',
            'name': usecase[1],
            'component': 'button',  
            'label': usecase[0]
        })

        if usecase[1] == 'Login':
            usecase_elements.append({
                'type': 'login_function',
                'component': 'login form',
                'label': 'Login'
            })
        elif usecase[1] == 'Register':
            usecase_elements.append({
                'type': 'register_function',
                'component': 'register form',  
                'label': 'Register'
            })
        elif usecase[1] == 'Dashboard':
            usecase_elements.append({
                'type': 'dashboard_function',
                'component': 'dashboard',
                'label': 'Dashboard'
            })
        elif usecase[1] == 'Checkout':
            usecase_elements.append({
                'type': 'checkout_function',
                'component': 'checkout',
                'label': 'Checkout'
            })
        elif usecase[1] == 'Payment':
            usecase_elements.append({
                'type': 'payment_function',
                'component': 'payment',
                'label': 'Payment'
            })

        distinct_usecases.append(usecase_elements)

    return distinct_usecases

wireframe_elements = map_to_wireframe_elements(actors, usecases, relationships)

from PIL import Image, ImageDraw, ImageFont

def round_corner(radius, fill):
    size = (radius * 2, radius * 2)
    corner = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(corner)
    draw.pieslice([0, 0, radius * 2, radius * 2], 180, 270, fill=fill)
    return corner

def phone_template(size, radius, fill, border_color, border_width):
    width, height = size
    rectangle = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    corner = round_corner(radius, fill)
    
    rectangle.paste(corner, (0, 0))
    rectangle.paste(corner.rotate(90), (0, height - radius))
    rectangle.paste(corner.rotate(180), (width - radius, height - radius))
    rectangle.paste(corner.rotate(270), (width - radius, 0))
    
    draw = ImageDraw.Draw(rectangle)
    
    draw.rectangle([radius, 0, width - radius, border_width], fill=border_color)  # Top edge
    draw.rectangle([radius, height - border_width, width - radius, height], fill=border_color)  # Bottom edge
    draw.rectangle([0, radius, border_width, height - radius], fill=border_color)  # Left edge
    draw.rectangle([width - border_width, radius, width, height - radius], fill=border_color)  # Right edge
    
    draw.arc([(0, 0), (radius * 2, radius * 2)], 180, 270, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, 0), (width, radius * 2)], 270, 360, fill=border_color, width=border_width)
    draw.arc([(0, height - radius * 2), (radius * 2, height)], 90, 180, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, height - radius * 2), (width, height)], 0, 90, fill=border_color, width=border_width)
    
    screen_margin = 20
    screen_height = height - 100 - 2 * screen_margin
    
    total_vertical_space = height - 100 - screen_height
    top_space = total_vertical_space // 2
    
    screen = [screen_margin, top_space + screen_margin, width - screen_margin, top_space + screen_margin + screen_height]
    draw.rectangle(screen, outline=border_color, width=border_width)
    
    speaker_width = 50
    speaker_height = 10
    speaker = [(width - speaker_width) // 2, screen[1] // 2 - speaker_height // 2,
               (width + speaker_width) // 2, screen[1] // 2 + speaker_height // 2]
    draw.rectangle(speaker, fill=border_color)
    
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

    phone_screen = phone_template((img_width, img_height), border_radius, "white", "black", border_width)
    img.paste(phone_screen, (0, 0), phone_screen)

    internal_screen_x = screen_margin + 10
    internal_screen_y = screen_margin + 70  
    internal_screen_width = img_width - 2 * (screen_margin + 10)
    internal_screen_height = img_height - 2 * screen_margin - 150 

    for element in elements:
        if isinstance(element, dict) and 'type' in element:
            if element['type'] == 'login_function':
                draw_login_form(draw, screen_margin, screen_width, screen_height, border_width)
            elif element['type'] == 'register_function':
                draw_register_form(draw, screen_margin, screen_width, screen_height, border_width)
            elif element['type'] == 'dashboard_function':
                draw_dashboard(draw, internal_screen_x, internal_screen_y, internal_screen_width, internal_screen_height, border_width)
            elif element['type'] == 'checkout_function':
                draw_checkout(draw, internal_screen_x, internal_screen_y, internal_screen_width, internal_screen_height, border_width)
            elif element['type'] == 'payment_function':
                draw_payment(draw, internal_screen_x, internal_screen_y, internal_screen_width, internal_screen_height, border_width)
    
    image_path = os.path.normpath(image_path)
    img.save(image_path)
    print(f"Image saved at: {image_path}")
    return image_path

def draw_login_form(draw, screen_margin, screen_width, screen_height, border_width):
    form_width = screen_width - 40
    form_height = 250
    form_x = (screen_width - form_width) // 2
    form_y = (screen_height - form_height) // 2

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
    # Add space between title and username label
    space_after_title = 40
    username_label_y = title_y + title_height + space_after_title
    draw.text((screen_margin + form_x + 10, username_label_y), username_label, fill="black", font=label_font)
    
    # Add space between username label and password label
    space_after_username_label = 50
    password_label_y = username_label_y + space_after_username_label
    draw.text((screen_margin + form_x + 10, password_label_y), password_label, fill="black", font=label_font)

    field_width = form_width - 20
    field_height = 20
    
    # Add space between username label and username field
    space_after_username_label = 20
    username_field_y = username_label_y + space_after_username_label
    draw.rectangle([screen_margin + form_x + 10, username_field_y,
                    screen_margin + form_x + 10 + field_width, username_field_y + field_height],
                   outline="black", width=border_width)
    
    # Add space between password label and password field
    space_after_password_label = 20
    password_field_y = password_label_y + space_after_password_label
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
    form_height = 300
    form_x = (screen_width - form_width) // 2
    form_y = (screen_height - form_height) // 2

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

    space_after_title = 40
    space_between_labels = 50
    space_between_label_and_field = 20

    username_label_y = title_y + title_height + space_after_title
    email_label_y = username_label_y + space_between_labels
    password_label_y = email_label_y + space_between_labels
    confirm_password_label_y = password_label_y + space_between_labels

    draw.text((screen_margin + form_x + 10, username_label_y), username_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, email_label_y), email_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, password_label_y), password_label, fill="black", font=label_font)
    draw.text((screen_margin + form_x + 10, confirm_password_label_y), confirm_password_label, fill="black", font=label_font)

    field_width = form_width - 20
    field_height = 20

    username_field_y = username_label_y + space_between_label_and_field
    email_field_y = email_label_y + space_between_label_and_field
    password_field_y = password_label_y + space_between_label_and_field
    confirm_password_field_y = confirm_password_label_y + space_between_label_and_field

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
    button_y = confirm_password_field_y + field_height + 20  # Ensure button is below the last field
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

def draw_dashboard(draw, screen_x, screen_y, screen_width, screen_height, border_width):
    vertical_offset = -30

    logo_radius = 20
    logo_x = screen_x + logo_radius + 10
    logo_y = screen_y + logo_radius + 10 + vertical_offset
    draw.ellipse([logo_x - logo_radius, logo_y - logo_radius, logo_x + logo_radius, logo_y + logo_radius],
                 outline="black", width=border_width)

    app_name_text = "App Name"
    app_name_font_size = 14
    try:
        app_name_font = ImageFont.truetype("arial.ttf", app_name_font_size)
    except IOError:
        app_name_font = ImageFont.load_default()
    app_name_bbox = draw.textbbox((0, 0), app_name_text, font=app_name_font)
    app_name_width = app_name_bbox[2] - app_name_bbox[0]
    app_name_height = app_name_bbox[3] - app_name_bbox[1]
    app_name_x = screen_x + screen_width - app_name_width - 10
    app_name_y = logo_y - app_name_height // 2
    draw.text((app_name_x, app_name_y), app_name_text, fill="black", font=app_name_font)

    welcome_text = "Welcome back!"
    welcome_font_size = 24
    try:
        welcome_font = ImageFont.truetype("arial.ttf", welcome_font_size)
    except IOError:
        welcome_font = ImageFont.load_default()
    welcome_bbox = draw.textbbox((0, 0), welcome_text, font=welcome_font)
    welcome_width = welcome_bbox[2] - welcome_bbox[0]
    welcome_x = screen_x + (screen_width - welcome_width) // 2
    welcome_y = logo_y + logo_radius + 20
    draw.text((welcome_x, welcome_y), welcome_text, fill="black", font=welcome_font)

    navbar_height = 50
    navbar_y = screen_y + screen_height - navbar_height
    draw.rectangle([screen_x, navbar_y, screen_x + screen_width, screen_y + screen_height], outline="black", width=border_width)

    navbar_items = ["Home", "Notifications", "Settings"]
    num_items = len(navbar_items)
    item_width = screen_width // num_items

    for i, item in enumerate(navbar_items):
        item_x = screen_x + i * item_width
        item_y = navbar_y + (navbar_height - app_name_font_size) // 2
        item_text_width = draw.textbbox((0, 0), item, font=app_name_font)[2] - draw.textbbox((0, 0), item, font=app_name_font)[0]
        draw.text((item_x + (item_width - item_text_width) // 2, item_y), item, fill="black", font=app_name_font)

def draw_checkout(draw, screen_x, screen_y, screen_width, screen_height, border_width):
    vertical_offset = -30

    logo_radius = 20
    logo_x = screen_x + logo_radius + 10
    logo_y = screen_y + logo_radius + 10 + vertical_offset
    draw.ellipse([logo_x - logo_radius, logo_y - logo_radius, logo_x + logo_radius, logo_y + logo_radius],
                 outline="black", width=border_width)

    app_name_text = "App Name"
    app_name_font_size = 14
    try:
        app_name_font = ImageFont.truetype("arial.ttf", app_name_font_size)
    except IOError:
        app_name_font = ImageFont.load_default()
    app_name_bbox = draw.textbbox((0, 0), app_name_text, font=app_name_font)
    app_name_width = app_name_bbox[2] - app_name_bbox[0]
    app_name_height = app_name_bbox[3] - app_name_bbox[1]
    app_name_x = screen_x + screen_width - app_name_width - 10
    app_name_y = logo_y - app_name_height // 2
    draw.text((app_name_x, app_name_y), app_name_text, fill="black", font=app_name_font)

    vertical_offset += 50

    header_text = "Checkout"
    header_font_size = 24
    try:
        header_font = ImageFont.truetype("arial.ttf", header_font_size)
    except IOError:
        header_font = ImageFont.load_default()
    header_bbox = draw.textbbox((0, 0), header_text, font=header_font)
    header_width = header_bbox[2] - header_bbox[0]
    header_height = header_bbox[3] - header_bbox[1]
    header_x = screen_x + (screen_width - header_width) // 2
    header_y = screen_y + 10 + vertical_offset
    draw.text((header_x, header_y), header_text, fill="black", font=header_font)

    address_text = "Address: 1234 Example St"
    contact_text = "Contact: +123456789"
    address_font_size = 18
    try:
        address_font = ImageFont.truetype("arial.ttf", address_font_size)
    except IOError:
        address_font = ImageFont.load_default()
    address_y = header_y + header_height + 30  # Add space below the header
    contact_y = address_y + 30
    draw.text((screen_x + 10, address_y), address_text, fill="black", font=address_font)
    draw.text((screen_x + 10, contact_y), contact_text, fill="black", font=address_font)

    product_list_text = "Product List"
    product_list_font_size = 20
    try:
        product_list_font = ImageFont.truetype("arial.ttf", product_list_font_size)
    except IOError:
        product_list_font = ImageFont.load_default()
    product_list_y = contact_y + 50
    draw.text((screen_x + 10, product_list_y), product_list_text, fill="black", font=product_list_font)

    products = [
        {"name": "Product 1", "quantity": 2, "price": 10.00},
        {"name": "Product 2", "quantity": 1, "price": 20.00},
        {"name": "Product 3", "quantity": 3, "price": 5.00},
        {"name": "Product 4", "quantity": 1, "price": 15.00}
    ]
    product_font_size = 16
    try:
        product_font = ImageFont.truetype("arial.ttf", product_font_size)
    except IOError:
        product_font = ImageFont.load_default()
    product_y = product_list_y + 30
    total_price = 0
    for product in products:
        item_total = product["quantity"] * product["price"]
        total_price += item_total
        draw.text((screen_x + 10, product_y), f"{product['name']} (x{product['quantity']})", fill="black", font=product_font)
        draw.text((screen_x + screen_width - 60, product_y), f"${item_total:.2f}", fill="black", font=product_font)
        product_y += 30

    total_price_text = f"Total: ${total_price:.2f}"
    total_price_font_size = 20
    try:
        total_price_font = ImageFont.truetype("arial.ttf", total_price_font_size)
    except IOError:
        total_price_font = ImageFont.load_default()
    total_price_y = product_y + 150
    draw.text((screen_x + 10, total_price_y), total_price_text, fill="black", font=total_price_font)

    vouchers_text = "Vouchers"
    vouchers_font_size = 20
    try:
        vouchers_font = ImageFont.truetype("arial.ttf", vouchers_font_size)
    except IOError:
        vouchers_font = ImageFont.load_default()
    vouchers_y = total_price_y + 30
    draw.text((screen_x + 10, vouchers_y), vouchers_text, fill="black", font=vouchers_font)

    button_width = 200
    button_height = 40
    button_x = screen_x + (screen_width - button_width) // 2
    button_y = screen_y + screen_height - button_height - 20
    draw.rectangle([button_x, button_y, button_x + button_width, button_y + button_height], fill="black")

    button_text = "Proceed to Payment"
    button_font_size = 20
    try:
        button_font = ImageFont.truetype("arial.ttf", button_font_size)
    except IOError:
        button_font = ImageFont.load_default()
    button_bbox = draw.textbbox((0, 0), button_text, font=button_font)
    button_text_width = button_bbox[2] - button_bbox[0]
    button_text_height = button_bbox[3] - button_bbox[1]
    button_text_x = button_x + (button_width - button_text_width) // 2
    button_text_y = button_y + (button_height - button_text_height) // 2
    draw.text((button_text_x, button_text_y), button_text, fill="white", font=button_font)

def draw_payment(draw, screen_x, screen_y, screen_width, screen_height, border_width):
    vertical_offset = -30

    logo_radius = 20
    logo_x = screen_x + logo_radius + 10
    logo_y = screen_y + logo_radius + 10 + vertical_offset
    draw.ellipse([logo_x - logo_radius, logo_y - logo_radius, logo_x + logo_radius, logo_y + logo_radius],
                 outline="black", width=border_width)

    app_name_text = "App Name"
    app_name_font_size = 14
    try:
        app_name_font = ImageFont.truetype("arial.ttf", app_name_font_size)
    except IOError:
        app_name_font = ImageFont.load_default()
    app_name_bbox = draw.textbbox((0, 0), app_name_text, font=app_name_font)
    app_name_width = app_name_bbox[2] - app_name_bbox[0]
    app_name_height = app_name_bbox[3] - app_name_bbox[1]
    app_name_x = screen_x + screen_width - app_name_width - 10
    app_name_y = logo_y - app_name_height // 2
    draw.text((app_name_x, app_name_y), app_name_text, fill="black", font=app_name_font)

    vertical_offset += 50

    header_text = "Confirm Payment"
    header_font_size = 24
    try:
        header_font = ImageFont.truetype("arial.ttf", header_font_size)
    except IOError:
        header_font = ImageFont.load_default()
    header_bbox = draw.textbbox((0, 0), header_text, font=header_font)
    header_width = header_bbox[2] - header_bbox[0]
    header_height = header_bbox[3] - header_bbox[1]
    header_x = screen_x + (screen_width - header_width) // 2
    header_y = screen_y + 10 + vertical_offset
    draw.text((header_x, header_y), header_text, fill="black", font=header_font)

    details_font_size = 18
    try:
        details_font = ImageFont.truetype("arial.ttf", details_font_size)
    except IOError:
        details_font = ImageFont.load_default()

    details_y = header_y + header_height + 30
    details = [
        f"Order ID: 123456",
        f"Total Quantity: 6",
        f"Total Price: $55.00",
        f"Shipping Fee: $5.00"
    ]
    for i, detail in enumerate(details):
        draw.text((screen_x + 10, details_y + i * 30), detail, fill="black", font=details_font)

    payment_method_text = "Payment Method"
    payment_method_font_size = 20
    try:
        payment_method_font = ImageFont.truetype("arial.ttf", payment_method_font_size)
    except IOError:
        payment_method_font = ImageFont.load_default()
    payment_method_y = details_y + len(details) * 30 + 30
    draw.text((screen_x + 10, payment_method_y), payment_method_text, fill="black", font=payment_method_font)

    dropdown_y = payment_method_y + 30
    dropdown_width = screen_width - 20
    dropdown_height = 30
    draw.rectangle([screen_x + 10, dropdown_y, screen_x + 10 + dropdown_width, dropdown_y + dropdown_height],
                   outline="black", width=border_width)
    draw.text((screen_x + 20, dropdown_y + 5), "Select payment method...", fill="black", font=details_font)

    button_width = 180
    button_height = 40
    button_x = screen_x + (screen_width - button_width) // 2
    button_y = screen_y + screen_height - button_height - 20
    draw.rectangle([button_x, button_y, button_x + button_width, button_y + button_height], fill="black")

    button_text = "Confirm Payment"
    button_font_size = 20
    try:
        button_font = ImageFont.truetype("arial.ttf", button_font_size)
    except IOError:
        button_font = ImageFont.load_default()
    button_bbox = draw.textbbox((0, 0), button_text, font=button_font)
    button_text_width = button_bbox[2] - button_bbox[0]
    button_text_height = button_bbox[3] - button_bbox[1]
    button_text_x = button_x + (button_width - button_text_width) // 2
    button_text_y = button_y + (button_height - button_text_height) // 2
    draw.text((button_text_x, button_text_y), button_text, fill="white", font=button_font)

import os 
import sys

import os
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <plantuml_script>")
        sys.exit(1)
    
    plantuml_script = sys.argv[1]
    output_dir = 'C:/wirefully_softeng/backend/myenv/generated_images'
    
    try:
        validate_plantuml_script(plantuml_script)
    except ValueError as e:
        print(e)
        sys.exit(1)
    
    parsed_text = parse_text(plantuml_script)
    print("Parsed Text:", parsed_text)

    actors, usecases, relationships = syntax_analysis(plantuml_script)
    print("Actors:", actors)
    print("Use Cases:", usecases)
    print("Relationships:", relationships)

    wireframe_elements_list = map_to_wireframe_elements(actors, usecases, relationships)
    print("Wireframe Elements:", wireframe_elements_list)

    image_paths = []
    for idx, elements in enumerate(wireframe_elements_list):
        image_filename = f'phone_wireframe_template_{idx + 1}.png'
        image_path = os.path.join(output_dir, image_filename)
        generated_image_path = generate_phone_wireframe_template(elements, image_path)
        image_paths.append(generated_image_path)

        # Print actor and image path information
        for actor in actors:
            print(f"Actor: {actor}, {generated_image_path}")
    
    print("Image Paths:", image_paths)
    relative_image_paths = [os.path.relpath(path, output_dir) for path in image_paths]
    print("Relative Image Paths:", relative_image_paths)

    return image_paths, relative_image_paths

if __name__ == "__main__":
    main()


