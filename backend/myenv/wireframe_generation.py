from PIL import Image, ImageDraw, ImageFont

# Example wireframe elements
wireframe_elements = [
    {'name': 'Register'},
    {'name': 'Login'},
    {'name': 'Home'},
    {'name': 'Profile'},
]

def generate_layout(use_case):
    layout = {}
    x, y = 50, 50

    if use_case == 'Login':
        layout[f"username"] = {'x': x, 'y': y}
        y += 70
        layout[f"password"] = {'x': x, 'y': y}
        y += 70
        layout[f"LOGIN"] = {'x': x, 'y': y}
    elif use_case == 'Register':
        layout[f"username"] = {'x': x, 'y': y}
        y += 70
        layout[f"password"] = {'x': x, 'y': y}
        y += 70
        layout[f"email"] = {'x': x, 'y': y}
        y += 70
        layout[f"REGISTER"] = {'x': x, 'y': y}
    else:
        layout[use_case] = {'x': x, 'y': y}

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

def generate_wireframe_image(layout, use_case):
    img_width = 400
    img_height = 800
    screen_margin = 20
    border_radius = 20
    border_width = 2
    screen_width = img_width - 2 * screen_margin
    screen_height = img_height - 2 * screen_margin

    img = Image.new('RGB', (img_width, img_height), 'white')
    draw = ImageDraw.Draw(img)

    phone_screen = round_rectangle((screen_width, screen_height), border_radius, "white", "black", border_width)
    img.paste(phone_screen, (screen_margin, screen_margin), phone_screen)

    for element, position in layout.items():
        x = position['x'] + screen_margin
        y = position['y'] + screen_margin
        if 'username' in element or 'password' in element or 'email' in element:  # Check if it's a text field
            draw_text_field(draw, (x, y), 200, 30, element, border_width=border_width, border_color="black")
        elif 'REGISTER' in element:  # If it's the 'REGISTER' button
            element_rect = round_rectangle((200, 50), border_radius, "lightblue", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + 100, y + 25), element, fill='black', font=ImageFont.load_default(), anchor='mm')
        elif 'LOGIN' in element:  # If it's the 'LOGIN' button
            element_rect = round_rectangle((200, 50), border_radius, "lightgreen", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + 100, y + 25), element, fill='black', font=ImageFont.load_default(), anchor='mm')
        else:
            element_rect = round_rectangle((200, 50), border_radius, "lightgrey", "black", border_width)
            img.paste(element_rect, (x, y), element_rect)
            draw.text((x + 100, y + 25), element, fill='black', font=ImageFont.load_default(), anchor='mm')

    img.show()
    img.save(f'{use_case}.png')  # Save the image for each use case

for element in wireframe_elements:
    layout = generate_layout(element['name'])
    print(f"Layout for {element['name']}: {layout}")
    generate_wireframe_image(layout, element['name'])


