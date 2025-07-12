import joblib

model = joblib.load("../model/final.pkl")

def check_comment(text: str) -> str:
    result = model.predict([text])[0]
    return "unsafe" if result == 1 else "safe"