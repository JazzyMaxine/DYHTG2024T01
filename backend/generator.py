import librosa
import os
import json
import zipfile
from pydub import AudioSegment
from pathlib import Path
import numpy as np

# Set the folder where your MP3 files are located
AUDIO_INPUT_FOLDER = 'unconvertedAudio'
OUTPUT_FOLDER = 'output_beatmap'


def analyze_mp3(mp3_file_path):
    """
    Analyze the MP3 file and extract beats using librosa.
    """
    print(f"Analyzing {mp3_file_path} for beat detection...")

    # Load the MP3 file using librosa
    y, sr = librosa.load(mp3_file_path, sr=None)
    
    # Perform beat tracking to get beats and BPM
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    
    # Convert beats (in frames) to time (in seconds)
    beat_times = librosa.frames_to_time(beats, sr=sr)

    print(f"Detected BPM: {tempo}")
    print(f"Number of beats: {len(beat_times)}")

    return tempo, beat_times


def generate_beatmap(tempo, beat_times, metadata):
    """
    Generate a basic beatmap based on the analyzed beats and metadata.
    The beatmap is stored as a dictionary, simulating a simplified `.osu` file.
    """
    beatmap = {
        "metadata": metadata,
        "bpm": tempo,
        "beatmap": [round(beat_time, 3) for beat_time in beat_times]  # Rounded to 3 decimal places
    }
    
    return beatmap


def save_beatmap_to_json(beatmap, output_file):
    # Check if any ndarray object exists and convert to list
    def convert_ndarray_to_list(data):
        if isinstance(data, np.ndarray):
            return data.tolist()  # Convert ndarray to list
        elif isinstance(data, dict):
            # Recursively handle dicts
            return {key: convert_ndarray_to_list(value) for key, value in data.items()}
        elif isinstance(data, list):
            # Recursively handle lists
            return [convert_ndarray_to_list(item) for item in data]
        else:
            return data

    # Convert any NumPy arrays in the beatmap to lists
    beatmap = convert_ndarray_to_list(beatmap)
    
    # Save as JSON
    with open(output_file, 'w') as json_file:
        json.dump(beatmap, json_file, indent=4)


def package_as_osz(mp3_file_path, beatmap_json_path, output_dir):
    """
    Package the MP3 and the beatmap JSON into an .osz file.
    """
    mp3_filename = os.path.basename(mp3_file_path)
    beatmap_filename = os.path.basename(beatmap_json_path)
    osz_filename = os.path.join(output_dir, f"{Path(mp3_file_path).stem}.osz")

    with zipfile.ZipFile(osz_filename, 'w') as osz_file:
        osz_file.write(mp3_file_path, arcname=mp3_filename)
        osz_file.write(beatmap_json_path, arcname=beatmap_filename)

    print(f"Packaged beatmap and audio into {osz_filename}")


def process_mp3_file(mp3_file_path, output_dir):
    """
    Process an individual MP3 file by analyzing it, generating a beatmap,
    saving it as JSON, and packaging it into an .osz archive.
    """
    # Ensure the output directory exists
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Extract metadata from the file name (you can adjust this to read ID3 tags)
    metadata = {
        "Artist": "Unknown Artist",
        "Title": Path(mp3_file_path).stem,
        "Creator": "AutoGenerated",
        "Version": "Easy"
    }
    
    # Analyze the MP3 file and extract beats
    tempo, beat_times = analyze_mp3(mp3_file_path)
    
    # Generate a beatmap based on the analysis
    beatmap = generate_beatmap(tempo, beat_times, metadata)
    
    # Save the beatmap to a JSON file
    beatmap_json_path = os.path.join(output_dir, f"{Path(mp3_file_path).stem}.json")
    save_beatmap_to_json(beatmap, beatmap_json_path)
    
    # Package the MP3 and beatmap JSON into an .osz archive
    package_as_osz(mp3_file_path, beatmap_json_path, output_dir)


def process_all_mp3_files(input_folder, output_folder):
    """
    Iterate through all MP3 files in the input folder and process each one.
    """
    mp3_files = [f for f in os.listdir(input_folder) if f.endswith('.mp3')]

    if not mp3_files:
        print(f"No MP3 files found in {input_folder}.")
        return

    for mp3_file in mp3_files:
        mp3_file_path = os.path.join(input_folder, mp3_file)
        print(f"Processing: {mp3_file_path}")
        process_mp3_file(mp3_file_path, output_folder)

    print("All MP3 files processed.")


if __name__ == "__main__":
    # Check if input and output directories exist
    Path(AUDIO_INPUT_FOLDER).mkdir(parents=True, exist_ok=True)

    # Process all MP3 files in the input folder
    process_all_mp3_files(AUDIO_INPUT_FOLDER, 'beatmap_archive')

