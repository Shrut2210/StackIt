import requests
import io

def check_image_from_url(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        content = response.content
        return check_image(content)
    except requests.exceptions.RequestException as e:
        return {"error": f"Could not fetch image: {str(e)}"}

def check_image_from_path(image_path: str):
    with io.open(image_path, "rb") as image_file:
        content = image_file.read()
    return check_image(content)

def check_image(content: str) -> str:
    image_path = content

    url = 'https://api.sightengine.com/1.0/check.json'

    files = {
        'media': ('image.jpg', io.BytesIO(content), 'image/jpeg')
    }
    data = {
        'models': 'nudity,wad',
        'api_user': 1914000579,
        'api_secret': 'MMFNMuMYLod4WPejJehHoBs7AZ9w5uqS'
    }

    response = requests.post(url, files=files, data=data)
    result = response.json()

    print(result)

    if result['nudity']['raw'] > 0.5 or result['weapon'] > 0.5 or result['alcohol'] > 0.5:
        return "Unsafe"
    else:
        return "Safe"