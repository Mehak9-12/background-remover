import os
import io
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from rembg import remove, new_session

# Load the .env file
load_dotenv()

app = FastAPI()
session = new_session("u2net")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    input_data = await file.read()
    output_data = remove(input_data, session=session)
    return StreamingResponse(io.BytesIO(output_data), media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    # Pull values from .env with fallbacks
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)