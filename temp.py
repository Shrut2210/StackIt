import requests

api_user = 'your_api_user'
api_secret = 'your_api_secret'
image_path = './alcohol.jpg'

url = 'https://api.sightengine.com/1.0/check.json'

files = {'media': open(image_path, 'rb')}
data = {
    'models': 'nudity,wad',
    'api_user': 1914000579,
    'api_secret': 'MMFNMuMYLod4WPejJehHoBs7AZ9w5uqS'
}

response = requests.post(url, files=files, data=data)
result = response.json()

print(result)

# Check if image is unsafe
if result['nudity']['raw'] > 0.5 or result['weapon'] > 0.5 or result['alcohol'] > 0.5:
    print("Image is unsafe")
else:
    print("Image is safe")