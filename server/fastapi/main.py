from fastapi import FastAPI
from pydantic import BaseModel
from model import check_comment

# run using the following command
# uvicorn main:app --reload

app = FastAPI()

class TextInput(BaseModel):
    text: str

class TextOutput(BaseModel):
    result: str

@app.post("/check", response_model=TextOutput)
async def check_text(input_text: TextInput):
    result = check_comment(input_text.text)
    return {"result": result}