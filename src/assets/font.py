import os
from fontTools.ttLib import TTFont


def print_font_weights(font_folder):
    font_weights = {}
    for root, dirs, files in os.walk(font_folder):
        for file in files:
            if file.endswith(".otf") or file.endswith(".ttf"):
                font_path = os.path.join(root, file)
                try:
                    font = TTFont(font_path)
                    weight = font["OS/2"].usWeightClass
                    font_weights[font_path] = weight
                except Exception as e:
                    print(f"Error reading {font_path}: {e}")
    return font_weights


font_folder = "fonts"
font_weights = print_font_weights(font_folder)

for font, weight in font_weights.items():
    print(f"Font: {font}, Weight: {weight}")
