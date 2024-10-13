import os
import zipfile
from io import BytesIO
from flask import Flask, jsonify, send_file, request
from pathlib import Path
from flask_cors import CORS
import json

# Import the convert and pad_audio logic from your existing scripts
from convert import parse_osu_file, save_to_json
from PadAudio import pad_audio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default
# Directories
BEATMAP_ARCHIVE_DIR = "beatmap_archive"  # Where .osz files are stored
CACHE_DIR = "cache"  # Where processed beatmaps are cached
TEMP_DIR = "temp_files"  # Temporary directory for unzipping and processing
Path(BEATMAP_ARCHIVE_DIR).mkdir(exist_ok=True)
Path(CACHE_DIR).mkdir(exist_ok=True)
Path(TEMP_DIR).mkdir(exist_ok=True)

# Global variable to store the list of available beatmaps
available_beatmaps = []
ip='172.20.10.4'

# Function to list available .osz files on server start
def list_beatmaps():
    global available_beatmaps
    available_beatmaps = [f for f in os.listdir(BEATMAP_ARCHIVE_DIR) if f.endswith('.osz')]
    print(f"Available beatmaps: {available_beatmaps}")

# Helper function to repackage an extracted folder into a .osz file
def repackage_beatmap(folder_path, beatmap_name):
    output_path = os.path.join(TEMP_DIR, beatmap_name)
    with zipfile.ZipFile(output_path, 'w') as zip_file:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zip_file.write(file_path, arcname=os.path.relpath(file_path, folder_path))
    return output_path

# Function to check cache for processed beatmap and audio
def check_cache(beatmap_name):
    beatmap_json_path = os.path.join(CACHE_DIR, f"{beatmap_name}.json")
    padded_audio_path = os.path.join(CACHE_DIR, f"{beatmap_name}_padded.mp3")

    if os.path.exists(beatmap_json_path) and os.path.exists(padded_audio_path):
        return beatmap_json_path, padded_audio_path
    return None, None
# Function to process beatmap (unzip, process .osu and audio, then cache results)
def process_and_cache_beatmap(beatmap_name):
    try:
        # Remove the '.osz' extension from beatmap_name
        beatmap_base_name = os.path.splitext(beatmap_name)[0]

        beatmap_path = os.path.join(BEATMAP_ARCHIVE_DIR, beatmap_name)
        extraction_folder = os.path.join(TEMP_DIR, beatmap_base_name)
        Path(extraction_folder).mkdir(exist_ok=True)
        
        with zipfile.ZipFile(beatmap_path, 'r') as zip_ref:
            zip_ref.extractall(extraction_folder)

        # Find .osu and audio files in the extracted directory
        osu_file = None
        audio_file = None
        for root, _, files in os.walk(extraction_folder):
            for file in files:
                if file.endswith('.osu'):
                    osu_file = os.path.join(root, file)
                elif file.endswith('.mp3'):
                    audio_file = os.path.join(root, file)

        if not osu_file or not audio_file:
            raise Exception("Missing .osu or audio file in archive")

        # Process .osu file into JSON
        beatmap_data = parse_osu_file(osu_file)
        beatmap_json_path = os.path.join(CACHE_DIR, f"{beatmap_base_name}.json")
        save_to_json(beatmap_data, beatmap_json_path)

        # Pad the audio file
        padded_audio_path = os.path.join(CACHE_DIR, f"{beatmap_base_name}_padded.mp3")
        pad_audio(audio_file, padded_audio_path)

        return beatmap_json_path, padded_audio_path

    except Exception as e:
        print(f"Error processing beatmap: {e}")
        return None, None


@app.route('/download_beatmap/<beatmap_name>', methods=['GET'])
def download_beatmap(beatmap_name):
    try:
        # Remove .osz extension for the filenames
        beatmap_base_name = os.path.splitext(beatmap_name)[0]

        # Check if the beatmap is already processed
        beatmap_json_path, padded_audio_path = check_cache(beatmap_base_name)
        
        if beatmap_json_path and padded_audio_path:
            # Open and return the content of the JSON file
            with open(beatmap_json_path, 'r') as json_file:
                beatmap_data = json.load(json_file)  # Load actual content of the JSON file
            
            # Debugging: log the JSON data before returning it
            print(f"Returning cached beatmap data for {beatmap_name}: {beatmap_data}")
            
            return jsonify({
                "beatmap_json": beatmap_data,  # Send actual content, not the filename
                "audio_file_url": f"http://{ip}:5000/download/{beatmap_base_name}_padded.mp3"  # Correct URL
            })

        # If not cached, process and cache the beatmap
        beatmap_json_path, padded_audio_path = process_and_cache_beatmap(beatmap_name)
        if beatmap_json_path and padded_audio_path:
            # Open and return the content of the newly processed JSON file
            with open(beatmap_json_path, 'r') as json_file:
                beatmap_data = json.load(json_file)

            # Debugging: log the JSON data after processing it
            print(f"Processed and returning beatmap data for {beatmap_name}: {beatmap_data}")
            
            return jsonify({
                "beatmap_json": beatmap_data,
                "audio_file_url": f"http://{ip}:5000/download/{beatmap_base_name}_padded.mp3"
            })
        else:
            return jsonify({"error": "Failed to process beatmap"}), 500
    except Exception as e:
        print(f"Error processing {beatmap_name}: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(CACHE_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "File not found"}), 404

@app.route('/list_beatmaps', methods=['GET'])
def list_beatmaps_api():
    try:
        return jsonify({"beatmaps": available_beatmaps})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ping the server on startup to list all available beatmaps
    list_beatmaps()
    app.run(host=ip, debug=True)
