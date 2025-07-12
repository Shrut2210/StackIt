from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from text_model import check_comment
from image_model_final import check_image, check_image_from_path, check_image_from_url
# from image_model import check_image, check_image_from_path, check_image_from_url
app = FastAPI()

class TextInput(BaseModel):
    text: str

class TextOutput(BaseModel):
    result: str
    
class ImageInput(BaseModel):
    path: str

@app.post("/check", response_model=TextOutput)
async def check_text(input_text: TextInput):
    result = check_comment(input_text.text)
    return {"result": result}

@app.post("/check-image")
async def check_image_api(input: ImageInput):
    if input.path.startswith("http"):
        result = check_image_from_url(input.path)
    else :
        result = check_image_from_path(input.path)
    return {"result": result}
