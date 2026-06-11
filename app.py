import os
import cv2
import numpy as np
import base64
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model

# Initialize App
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
RESULT_FOLDER = 'static/results'

# Model File Names
COLOR_MODEL_PATH = 'colorization_model_vibrant.h5'
BG_MODEL_PATH = 'high_accuracy_model.h5'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER

# --- LOAD MODELS ---
print("⏳ Loading Models...")
try:
    color_model = load_model(COLOR_MODEL_PATH, compile=False)
    print("✅ Colorization Model Loaded!")
except Exception as e:
    print(f"❌ Error loading Color Model: {e}")
    color_model = None

try:
    bg_model = load_model(BG_MODEL_PATH, compile=False)
    print("✅ Background Removal Model Loaded!")
except Exception as e:
    print(f"❌ Error loading BG Model: {e}")
    bg_model = None


# --- HELPER: ENCODE IMAGE TO BASE64 ---
def get_base64_string(file_path):
    """Reads a file from disk and returns the base64 data URI."""
    with open(file_path, "rb") as img_file:
        encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
    
    # Determine mime type based on extension
    ext = os.path.splitext(file_path)[1].lower().replace('.', '')
    # Handle jpg/jpeg mismatch
    if ext == 'jpg': ext = 'jpeg'
    
    return f"data:image/{ext};base64,{encoded_string}"


# --- PROCESSING FUNCTIONS ---

def model_colorize(image_path):
    if color_model is None: return image_path

    # 1. Read & Resize
    img = cv2.imread(image_path)
    if img is None: return image_path
    
    original_h, original_w = img.shape[:2]
    
    # Use the Improved "Sharpness" method if you wish, 
    # but sticking to your original flow for stability:
    img_resized = cv2.resize(img, (256, 256))
    lab = cv2.cvtColor(img_resized, cv2.COLOR_BGR2LAB)
    l_channel = lab[:, :, 0]

    input_data = l_channel.reshape(1, 256, 256, 1) / 255.0
    predicted_ab = color_model.predict(input_data)
    predicted_ab = (predicted_ab * 128) + 128
    
    result_lab = np.dstack((l_channel, predicted_ab[0]))
    result_bgr = cv2.cvtColor(result_lab.astype("uint8"), cv2.COLOR_LAB2BGR)
    
    result_bgr = cv2.resize(result_bgr, (original_w, original_h))

    filename = "colorized_" + os.path.basename(image_path)
    output_path = os.path.join(app.config['RESULT_FOLDER'], filename)
    cv2.imwrite(output_path, result_bgr)
    
    return output_path

def model_remove_background(image_path):
    if bg_model is None: return image_path

    img = cv2.imread(image_path)
    if img is None: return image_path
    
    original_h, original_w = img.shape[:2]

    img_resized = cv2.resize(img, (256, 256))
    input_data = img_resized.reshape(1, 256, 256, 3) / 255.0

    prediction = bg_model.predict(input_data)
    mask = prediction[0]
    mask = cv2.resize(mask, (original_w, original_h))
    mask = (mask > 0.5).astype(np.uint8) * 255

    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, mask])

    base_name = os.path.splitext(os.path.basename(image_path))[0]
    filename = f"nobg_{base_name}.png"
    output_path = os.path.join(app.config['RESULT_FOLDER'], filename)
    cv2.imwrite(output_path, rgba)

    return output_path


# --- ROUTING ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'file' not in request.files: return "No file", 400
    file = request.files['file']
    option = request.form.get('option')
    
    if file.filename == '': return "No filename", 400

    # 1. Save Initial Upload
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        # 2. Process Image
        if option == 'colorize':
            final_path = model_colorize(filepath)
        elif option == 'remove_bg':
            final_path = model_remove_background(filepath)
        elif option == 'both':
            temp_path = model_colorize(filepath)
            final_path = model_remove_background(temp_path)
        else:
            return "Invalid Option", 400

        # 3. Generate Base64 Strings for the Template
        # We read the files back from disk to encode them
        original_image_data = get_base64_string(filepath)
        result_image_data = get_base64_string(final_path)

        # 4. Pass BOTH to template
        return render_template('index.html', 
                               original_image=original_image_data, 
                               result_image=result_image_data)

    except Exception as e:
        print(f"Processing Error: {e}")
        return f"Error processing image: {e}", 500

if __name__ == '__main__':
    app.run(debug=True)