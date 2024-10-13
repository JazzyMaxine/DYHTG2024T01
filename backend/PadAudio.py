import argparse
from pydub import AudioSegment

def pad_audio(input_file, output_file, pad_duration=800):
    # Load your MP3 file
    audio = AudioSegment.from_mp3(input_file)

    # Create silence with the specified duration
    silence = AudioSegment.silent(duration=pad_duration)

    # Concatenate the silence with the original audio
    padded_audio = silence + audio

    # Export the result to a new MP3 file
    padded_audio.export(output_file, format="mp3")
    print(f"2.5 seconds of silence has been added to the start of '{input_file}' and saved as '{output_file}'.")

if __name__ == "__main__":
    # Initialize the argument parser
    parser = argparse.ArgumentParser(description="Pad an MP3 file with silence.")
    
    # Add input and output arguments
    parser.add_argument("input_file", type=str, help="Path to the input MP3 file")
    parser.add_argument("output_file", type=str, help="Path to the output MP3 file")
    
    # Parse arguments
    args = parser.parse_args()
    
    # Call the function to pad the audio
    pad_audio(args.input_file, args.output_file)
