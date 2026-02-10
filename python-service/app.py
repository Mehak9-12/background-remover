import os
import io
import uvicorn  # <-- Add this
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware # <-- Add this import
from rembg import remove, new_session

# Load the .env file
load_dotenv()

app = FastAPI()

# Initialize session
session = new_session("u2netp")

origins = [
    "https://mehak9-12.github.io", 
    "http://localhost:3000",
    "http://localhost:5173",  # Added Vite default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    input_data = await file.read()
    output_data = remove(input_data, session=session)
    return StreamingResponse(io.BytesIO(output_data), media_type="image/png")

# Correct way to start FastAPI in a script
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)