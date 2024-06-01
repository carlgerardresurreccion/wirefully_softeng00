from PIL import Image, ImageDraw, ImageFont
from map_to_wireframe import wireframe_elements

def generate_layout(wireframe_elements):
    layout = {}
    name_count = {}
    x, y = 50, 50
    for element in wireframe_elements:
        if 'name' not in element:
            print(f"Error: Missing 'name' key in element: {element}")
            continue  # Skip this element if 'name' key is missing

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
        y += 50  # Increment y-position for next element
    return layout

layout = generate_layout(wireframe_elements)
print("Layout:", layout)

def generate_wireframe_image(layout):
    img_width = 300
    img_height = 300
    img = Image.new('RGB', (img_width, img_height), color='white')
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()

    for element, position in layout.items():
        x, y = position['x'], position['y']
        draw.rectangle([x, y, x + 100, y + 30], outline='black')
        draw.text((x + 50, y + 15), element, fill='black', font=font, anchor='mm')

    img.show()

generate_wireframe_image(layout)
