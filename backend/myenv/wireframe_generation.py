from PIL import Image, ImageDraw, ImageFont
from map_to_wireframe import wireframe_elements

def generate_layout(use_case):
    layout = {}

    if use_case == 'Login':
        layout[f"username"] = {'width': 200, 'height': 30}
        layout[f"password"] = {'width': 200, 'height': 30}
        layout[f"LOGIN"] = {'width': 150, 'height': 40}
    elif use_case == 'Register':
        layout[f"username"] = {'width': 200, 'height': 30}
        layout[f"password"] = {'width': 200, 'height': 30}
        layout[f"email"] = {'width': 200, 'height': 30}
        layout[f"REGISTER"] = {'width': 150, 'height': 40}
    elif use_case == 'Dashboard':
        layout[f"Chart1"] = {'width': 300, 'height': 100}
        layout[f"Chart2"] = {'width': 300, 'height': 50}
        layout[f"Button2"] = {'width': 100, 'height': 40}
        layout[f"Button3"] = {'width': 100, 'height': 40}
        layout[f"Button4"] = {'width': 100, 'height': 40}
        #layout[f"Rectangle1"] = {'width': 200, 'height': 50}
        
    return layout

def round_corner(radius, fill):
    """Draw a round corner"""
    corner = Image.new('RGBA', (radius, radius), (0, 0, 0, 0))
    draw = ImageDraw.Draw(corner)
    draw.pieslice((0, 0, radius * 2, radius * 2), 180, 270, fill=fill)
    return corner

def round_rectangle(size, radius, fill, border_color, border_width):
    """Draw a rounded rectangle with a border"""
    width, height = size
    rectangle = Image.new('RGBA', (width, height), fill)
    corner = round_corner(radius, fill)
    rectangle.paste(corner, (0, 0))
    rectangle.paste(corner.rotate(90), (0, height - radius)) 
    rectangle.paste(corner.rotate(180), (width - radius, height - radius))
    rectangle.paste(corner.rotate(270), (width - radius, 0))

    draw = ImageDraw.Draw(rectangle)
    
    draw.line([(radius, 0), (width - radius, 0)], fill=border_color, width=border_width)
    draw.line([(radius, height - border_width), (width - radius, height - border_width)], fill=border_color, width=border_width)  
    draw.line([(0, radius), (0, height - radius)], fill=border_color, width=border_width)  
    draw.line([(width - border_width, radius), (width - border_width, height - radius)], fill=border_color, width=border_width) 

    draw.arc([(0, 0), (radius * 2, radius * 2)], 180, 270, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, 0), (width, radius * 2)], 270, 360, fill=border_color, width=border_width)
    draw.arc([(0, height - radius * 2), (radius * 2, height)], 90, 180, fill=border_color, width=border_width)
    draw.arc([(width - radius * 2, height - radius * 2), (width, height)], 0, 90, fill=border_color, width=border_width)

    return rectangle

def draw_text_field(draw, position, width, height, text, border_width=0, **kwargs):
    x, y = position
    border_color = kwargs.get('border_color', None)
    
    # Create a temporary image to get the text size
    temp_img = Image.new('RGB', (width, height), color='white')
    temp_draw = ImageDraw.Draw(temp_img)
    font = ImageFont.load_default()
    
    # Calculate the bounding box of the text
    text_bbox = temp_draw.textbbox((x, y), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    del temp_img, temp_draw
    
    # Draw the background rectangle
    draw.rectangle([(x, y), (x + width, y + height)], outline=border_color, width=border_width)
    # Draw the text in the center
    text_x = x + (width - text_width) // 2
    text_y = y + (height - text_height) // 2
    draw.text((text_x, text_y), text, fill='black', font=font)

def draw_navigation_bar(draw, screen_margin, screen_width):
    nav_height = 50  # Height of the navigation bar
    nav_color = "lightgrey"
    border_color = "black"
    border_width = 2

    # Draw the navigation bar
    nav_bar_rectangle = [(screen_margin, screen_margin), (screen_margin + screen_width, screen_margin + nav_height)]
    draw.rectangle(nav_bar_rectangle, fill=nav_color, outline=border_color, width=border_width)

    # Draw a line under the navigation bar
    draw.line([(screen_margin, screen_margin + nav_height), (screen_margin + screen_width, screen_margin + nav_height)], fill=border_color, width=border_width)

    # Draw navigation items
    nav_items = ["ApplicationName", "About us"]
    item_width = screen_width // len(nav_items)
    font = ImageFont.load_default()

    for i, item in enumerate(nav_items):
        x = screen_margin + i * item_width
        text_bbox = draw.textbbox((x, screen_margin), item, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        text_x = x + (item_width - text_width) // 2
        text_y = screen_margin + (nav_height - text_height) // 2
        draw.text((text_x, text_y), item, fill='black', font=font)

def dashboard_navigation_bar(draw, screen_margin, screen_width):
    nav_height = 50  # Height of the navigation bar
    nav_color = "lightgrey"
    border_color = "black"
    border_width = 2

    # Draw the navigation bar
    nav_bar_rectangle = [(screen_margin, screen_margin), (screen_margin + screen_width, screen_margin + nav_height)]
    draw.rectangle(nav_bar_rectangle, fill=nav_color, outline=border_color, width=border_width)

    # Draw a line under the navigation bar
    draw.line([(screen_margin, screen_margin + nav_height), (screen_margin + screen_width, screen_margin + nav_height)], fill=border_color, width=border_width)

    # Draw navigation items
    nav_items = ["ApplicationName", "Home", "Logout"]
    item_width = screen_width // len(nav_items)
    font = ImageFont.load_default()

    for i, item in enumerate(nav_items):
        x = screen_margin + i * item_width
        text_bbox = draw.textbbox((x, screen_margin), item, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        text_x = x + (item_width - text_width) // 2
        text_y = screen_margin + (nav_height - text_height) // 2
        draw.text((text_x, text_y), item, fill='black', font=font)

def generate_wireframe_image(layout, use_case):
    img_width = 400
    img_height = 600
    screen_margin = 20
    border_radius = 20
    border_width = 2
    screen_width = img_width - 2 * screen_margin
    screen_height = img_height - 2 * screen_margin

    img = Image.new('RGB', (img_width, img_height), 'white')
    draw = ImageDraw.Draw(img)

    phone_screen = round_rectangle((screen_width, screen_height), border_radius, "white", "black", border_width)
    img.paste(phone_screen, (screen_margin, screen_margin), phone_screen)

    nav_height = 50 
    total_elements_height = sum([position['height'] + 20 for position in layout.values()]) - 20
    start_y = ((screen_height - nav_height - total_elements_height) // 2) + nav_height + screen_margin

    for element, position in layout.items():
        width = position['width']
        height = position['height']
        x = (screen_width - width) // 2 + screen_margin
        y = start_y

        if 'username' in element or 'password' in element or 'email' in element:  # Check if it's a text field
            draw_text_field(draw, (x, y), width, height, element, border_width=border_width, border_color="black")
        elif 'REGISTER' in element:  
            element_rect = round_rectangle((width, height), border_radius, "lightblue", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')
            draw_navigation_bar(draw, screen_margin, screen_width)
        elif 'LOGIN' in element:  
            element_rect = round_rectangle((width, height), border_radius, "lightgreen", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')
            draw_navigation_bar(draw, screen_margin, screen_width)
        elif 'Button' in element:
            element_rect = round_rectangle((width, height), border_radius, "lightgrey", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')
        elif 'Chart' in element:
            element_rect = round_rectangle((width, height), border_radius, "lightyellow", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')
        elif 'Rectangle' in element:
            element_rect = round_rectangle((width, height), border_radius, "lightgrey", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')
        else:
            element_rect = round_rectangle((width, height), border_radius, "lightgrey", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + width // 2, y + height // 2), element, fill='black', font=ImageFont.load_default(), anchor='mm')

        start_y += height + 20
    
    if use_case == 'Dashboard':
        dashboard_navigation_bar(draw, screen_margin, screen_width)

    img.show()
    img.save(f'{use_case}.png') 


for element in wireframe_elements:
    if element['name'] != 'actor' and element['name'] != 'relationship':  # Exclude actors and relationships
        layout = generate_layout(element['name'])
        print(f"Layout for {element['name']}: {layout}")
        generate_wireframe_image(layout, element['name'])





