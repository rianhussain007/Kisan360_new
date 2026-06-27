import io
import time
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model import predict

app = FastAPI(title="Kisan360 Disease Detection Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-disease-detection"}

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(400, "Cannot decode image")

    t0 = time.time()
    result = predict(image)
    latency = round(time.time() - t0, 3)

    result["latency_seconds"] = latency
    result["input_image"] = file.filename
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
