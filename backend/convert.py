import json

def parse_osu_file(osu_file_path):
    metadata = {}
    beatmap = []
    bpm = 120  # Default BPM if not specified

    with open(osu_file_path, 'r', encoding='utf-8') as osu_file:
        current_section = None
        hit_objects = []
        timing_points = []

        for line in osu_file:
            line = line.strip()
            
            # Skip empty lines or comments
            if not line or line.startswith('//'):
                continue
            
            # Check for section headers (e.g., [Metadata], [HitObjects])
            if line.startswith('[') and line.endswith(']'):
                current_section = line[1:-1]
                continue
            
            if current_section == "Metadata":
                if ':' in line:
                    key, value = line.split(':', 1)
                    metadata[key.strip()] = value.strip()
            
            if current_section == "TimingPoints":
                # Timing points are important for BPM and beat length
                timing_points.append(line.split(','))

            if current_section == "HitObjects":
                # Hit objects give timing information for beats
                hit_objects.append(line.split(','))

    # Extract BPM from the first timing point or the most relevant one
    if timing_points:
        for point in timing_points:
            if len(point) > 1 and float(point[1]) > 0:
                beat_length = float(point[1])  # 1st valid timing point's beat length
                bpm = 60000 / beat_length  # Convert beat length to BPM
                break

    bpm = 0.408 * bpm
    # Process HitObjects to get the raw time differences (accurate to the melody)
    last_time = 0

    for obj in hit_objects:
        time = int(obj[2])  # Get the hit object's time (in milliseconds)
        if last_time > 0:
            time_diff = time - last_time  # Calculate time difference between notes
            beatmap.append(time_diff / 1000)  # Store in seconds for better readability
        last_time = time

    # Create the final JSON structure with metadata, BPM, and precise timings
    beatmap_data = {
        "metadata": metadata,
        "bpm": bpm,
        "beatmap": beatmap  # This contains raw timing differences in seconds
    }
    
    return beatmap_data

def save_to_json(data, output_file_path):
    with open(output_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)


# Example usage:
# osu_file_path = 'example.osu'
# output_file_path = 'beatmap.json'

# Parse the .osu file and convert to JSON
# beatmap_data = parse_osu_file(osu_file_path)

# Save the JSON data to a file
# save_to_json(beatmap_data, output_file_path)

# print(f"Beatmap data saved to {output_file_path}")
