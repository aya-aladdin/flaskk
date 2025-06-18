from flask import Flask, render_template, request
from PIL import Image
import math

app = Flask(__name__)

def round_color(color, factor=50):
    return tuple((round(c / factor) * factor for c in color))

def process_image(file, size=(23, 23), round_factor=50):
    img = Image.open(file).convert('RGB')
    img = img.resize(size)
    pixels = list(img.getdata())
    grid = []
    colors = {}
    color_index = 1

    for i in range(size[1]):
        row = []
        for j in range(size[0]):
            original_color = pixels[i * size[0] + j]
            rounded_color = round_color(original_color, round_factor)
            if rounded_color not in colors:
                colors[rounded_color] = color_index
                color_index += 1
            row.append(colors[rounded_color])
        grid.append(row)

    num_to_color = {v: f'rgb{str(k)}' for k, v in colors.items()}
    return grid, num_to_color

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['image']
        if file:
            grid, colors = process_image(file)
            return render_template('index.html', grid=grid, colors=colors)
    return render_template('index.html', grid=None, colors=None)

