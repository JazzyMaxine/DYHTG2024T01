import os
from pytube import YouTube

# Ensure the unconvertedAudio folder exists
def ensure_audio_folder_exists():
    if not os.path.exists('unconvertedAudio'):
        os.makedirs('unconvertedAudio')


# Function to download MP3 from YouTube link
def download_youtube_audio(youtube_url, output_folder):
    try:
        yt = YouTube(youtube_url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        print(f"Downloading: {yt.title}...")

        output_file = audio_stream.download(output_folder)

        # Rename the downloaded file to .mp3
        base, ext = os.path.splitext(output_file)
        mp3_file = base + '.mp3'
        os.rename(output_file, mp3_file)

        print(f"Downloaded and saved as: {mp3_file}")
        return mp3_file

    except Exception as e:
        print(f"Failed to download {youtube_url}: {e}")
        return None

# Function to update the text file by removing the converted link
def update_text_file(file_path, converted_link, delimiter):
    with open(file_path, 'r') as file:
        links = file.read().split(delimiter)

    # Remove the successfully converted link
    links = [link.strip() for link in links if link.strip() and link.strip() != converted_link]

    # Write the updated links back to the file
    with open(file_path, 'w') as file:
        file.write(delimiter.join(links))

    print(f"Updated the text file. Removed: {converted_link}")

    
# Function to download all YouTube links from a text file and remove each link upon successful download
def download_from_txt(file_path, delimiter='\n'):
    ensure_audio_folder_exists()

    with open(file_path, 'r') as file:
        content = file.read()

        # Split the file content using the specified delimiter
        youtube_links = content.split(delimiter)

        # Loop over each YouTube link and download the audio
        for youtube_link in youtube_links:
            youtube_link = youtube_link.strip()  # Clean whitespace/newlines
            if youtube_link:
                mp3_file = download_youtube_audio(youtube_link, 'unconvertedAudio')
                if mp3_file:
                    # Remove the successfully converted link from the text file
                    update_text_file(file_path, youtube_link, delimiter)


if __name__ == '__main__':
    # Example usage
    file_path = 'youtube_links.txt'
    delimiter = '\\n' 
    download_from_txt(file_path, delimiter)
