from google.cloud import vision
import io
import requests

client = vision.ImageAnnotatorClient()

likelihood_labels = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY')


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

def check_image(content: bytes) -> dict:
    try:
        image = vision.Image(content=content)
        response = client.safe_search_detection(image=image)
        safe = response.safe_search_annotation

        result = {
            "adult": likelihood_labels[safe.adult],
            "racy": likelihood_labels[safe.racy],
            "violence": likelihood_labels[safe.violence],
            "medical": likelihood_labels[safe.medical],
            "spoof": likelihood_labels[safe.spoof],
        }

        if safe.adult >= 3 or safe.racy >= 3:
            result["status"] = "Unsafe"
        else:
            result["status"] = "Safe"

        return result["status"]

    except Exception as e:
        return {"error": str(e)}
