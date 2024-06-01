from PIL import Image, ImageDraw, ImageFont
from map_to_wireframe import wireframe_elements

def generate_layout(wireframe_elements):
    layout = {}
    name_count = {}
    x, y = 50, 50
    for element in wireframe_elements:
        if 'name' not in element:
            print(f"Error: Missing 'name' key in element: {element}")
            continue

        name = element['name']
        if name in layout:
            if name in name_count:
                name_count[name] += 1
            else:
                name_count[name] = 1
            unique_name = f"{name}_{name_count[name]}"
        else:
            unique_name = name
            name_count[name] = 0

        layout[unique_name] = {'x': x, 'y': y}
        y += 50
    return layout

layout = generate_layout(wireframe_elements)
print("Layout:", layout)

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

def generate_wireframe_image(layout):
    img_width = 400
    img_height = 800
    screen_margin = 20
    border_radius = 20
    border_width = 2
    screen_width = img_width - 2 * screen_margin
    screen_height = img_height - 2 * screen_margin

    img = Image.new('RGB', (img_width, img_height), 'white')
    font = ImageFont.load_default()

    phone_screen = round_rectangle((screen_width, screen_height), border_radius, "white", "black", border_width)
    img.paste(phone_screen, (screen_margin, screen_margin), phone_screen)

    for element, position in layout.items():
        x = position['x'] + screen_margin
        y = position['y'] + screen_margin
        element_rect = round_rectangle((200, 50), border_radius, "lightgrey", "black", border_width)
        img.paste(element_rect, (x, y), element_rect)
        draw = ImageDraw.Draw(img)
        draw.text((x + 100, y + 25), element, fill='black', font=font, anchor='mm')

    img.show()

generate_wireframe_image(layout)
