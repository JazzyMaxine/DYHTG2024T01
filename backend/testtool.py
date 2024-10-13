import json
from pydub import AudioSegment

# Function to calculate total duration based on BPM and beat intervals
def calculate_beatmap_duration(beatmap_file_path, audio_file_path):
    try:
        # Load beatmap data from JSON
        with open(beatmap_file_path, 'r') as f:
            beatmap_data = json.load(f)
        
        # Extract bpm and beatmap intervals
        bpm = beatmap_data['bpm']
        beatmap_intervals = beatmap_data['beatmap']

        # Calculate the duration of one beat in seconds
        beat_interval = 60 / bpm

        # Calculate the total duration based on beatmap intervals
        total_duration = sum(interval * beat_interval for interval in beatmap_intervals)

        # Convert to minutes and seconds
        minutes = int(total_duration // 60)
        seconds = total_duration % 60

        print(f"BPM: {bpm}")
        print(f"Total Beatmap Duration: {minutes} minutes, {seconds:.2f} seconds")

        # Load the MP3 file and get its duration
        audio = AudioSegment.from_file(audio_file_path)
        audio_duration = len(audio) / 1000.0  # Duration in seconds
        
        # Subtract 2.5 seconds from the audio duration
        target_duration = audio_duration - 2.5
        
        # Convert target duration to minutes and seconds
        target_minutes = int(target_duration // 60)
        target_seconds = target_duration % 60
        print(f"Target Duration (MP3 length - 2.5s): {target_minutes} minutes, {target_seconds:.2f} seconds")

        # Compare the calculated beatmap duration with the target audio duration
        if abs(total_duration - target_duration) < 1:
            print("The beatmap is well synchronized with the target duration.")
        else:
            print(f"Adjust the beatmap. It differs by {abs(total_duration - target_duration):.2f} seconds.")
                
    except Exception as e:
        print(f"Error: {e}")

# Usage Example
if __name__ == "__main__":
    # Path to the beatmap JSON file
    beatmap_file_path = "cache/Mark_Ronson_-_Uptown_Funk_feat._Bruno_Mars.json"
    
    # Path to the MP3 file
    audio_file_path = "cache\Mark_Ronson_-_Uptown_Funk_feat._Bruno_Mars_padded.mp3"
    
    # Calculate and compare duration
    calculate_beatmap_duration(beatmap_file_path, audio_file_path)
