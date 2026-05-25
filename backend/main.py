from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from dotenv import load_dotenv

from openai import OpenAI

from pypdf import PdfReader

from urllib.parse import quote

import base64
import requests
import os

# =========================================
# LOAD ENV
# =========================================

load_dotenv()

# =========================================
# OPENROUTER CLIENT
# =========================================

client = OpenAI(

    api_key=os.getenv(
        "OPENROUTER_API_KEY"
    ),

    base_url=
    "https://openrouter.ai/api/v1"
)

# =========================================
# FASTAPI APP
# =========================================

app = FastAPI()

# =========================================
# CORS
# =========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================================
# HOME ROUTE
# =========================================

@app.get("/")

def home():

    return {

        "message":
        "ASnova AI Running Successfully"
    }

# =========================================
# CHAT ROUTE
# =========================================

@app.get("/chat")

def chat(prompt: str):

    try:

        response = client.chat.completions.create(

            model=
            "openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content":
                    """
                    You are ASnova AI,
                    a smart AI study assistant.

                    Always:
                    - explain clearly
                    - use points
                    - keep answers structured
                    - help students learn easily
                    """
                },

                {
                    "role": "user",

                    "content": prompt
                }

            ]
        )

        return {

            "response":
            response.choices[0]
            .message.content
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# PDF SUMMARY
# =========================================

@app.post("/upload-pdf")

async def upload_pdf(

    file: UploadFile = File(...)
):

    try:

        # READ PDF

        pdf = PdfReader(file.file)

        text = ""

        # EXTRACT TEXT

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # LIMIT TEXT

        text = text[:4000]

        # AI SUMMARY

        response = client.chat.completions.create(

            model=
            "openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content":
                    """
                    You are ASnova AI.

                    Summarize notes:
                    - in simple language
                    - using points
                    - easy for revision
                    """
                },

                {
                    "role": "user",

                    "content":
                    f"""
                    Summarize these notes:

                    {text}
                    """
                }

            ]
        )

        return {

            "summary":
            response.choices[0]
            .message.content
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# QUIZ GENERATOR
# =========================================

@app.post("/generate-quiz")

async def generate_quiz(

    file: UploadFile = File(...)
):

    try:

        # READ PDF

        pdf = PdfReader(file.file)

        text = ""

        # EXTRACT TEXT

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # LIMIT TEXT

        text = text[:4000]

        # AI QUIZ

        response = client.chat.completions.create(

            model=
            "openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content":
                    """
                    Generate 5 MCQs.

                    Format:

                    Question
                    A)
                    B)
                    C)
                    D)

                    Correct Answer:
                    """
                },

                {
                    "role": "user",

                    "content":
                    f"""
                    Generate quiz from:

                    {text}
                    """
                }

            ]
        )

        return {

            "quiz":
            response.choices[0]
            .message.content
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# FLASHCARDS
# =========================================

@app.post("/generate-flashcards")

async def generate_flashcards(

    file: UploadFile = File(...)
):

    try:

        # READ PDF

        pdf = PdfReader(file.file)

        text = ""

        # EXTRACT TEXT

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # LIMIT TEXT

        text = text[:4000]

        # AI FLASHCARDS

        response = client.chat.completions.create(

            model=
            "openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content":
                    """
                    Generate study flashcards.

                    Format:

                    Q:
                    A:

                    Keep answers short.
                    """
                },

                {
                    "role": "user",

                    "content":
                    f"""
                    Generate flashcards from:

                    {text}
                    """
                }

            ]
        )

        return {

            "flashcards":
            response.choices[0]
            .message.content
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# PYQ GENERATOR
# =========================================

@app.post("/generate-pyq")

async def generate_pyq(

    file: UploadFile = File(...),

    type: str = "important",

    difficulty: str = "medium",

    count: int = 5
):

    try:

        # READ PDF

        pdf = PdfReader(file.file)

        text = ""

        # EXTRACT TEXT

        for page in pdf.pages:

            extracted = page.extract_text()

            if extracted:

                text += extracted

        # LIMIT TEXT

        text = text[:5000]

        # QUESTION TYPE

        if type == "important":

            question_type = "important exam questions"

        elif type == "long":

            question_type = "long answer questions"

        elif type == "short":

            question_type = "short answer questions"

        elif type == "viva":

            question_type = "viva questions"

        else:

            question_type = "important questions"

        # AI GENERATION

        response = client.chat.completions.create(

            model=
            "openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content":
                    f"""
                    You are ASnova AI.

                    Generate {count}
                    {question_type}.

                    Difficulty:
                    {difficulty}

                    Rules:

                    - exam focused
                    - important concepts
                    - clear formatting
                    - use numbering
                    - easy to revise
                    """
                },

                {
                    "role": "user",

                    "content":
                    f"""
                    Generate questions from:

                    {text}
                    """
                }

            ]
        )

        return {

            "pyq":
            response.choices[0]
            .message.content
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# IMAGE ANALYSIS
# =========================================

@app.post("/analyze-image")

async def analyze_image(

    file: UploadFile = File(...)
):

    try:

        # READ IMAGE

        image_bytes = await file.read()

        # BASE64

        base64_image = base64.b64encode(

            image_bytes

        ).decode("utf-8")

        # AI VISION

        response = client.chat.completions.create(

            model="openai/gpt-4o-mini",

            messages=[

                {
                    "role": "system",

                    "content":
                    """
                    You are ASnova Vision AI.

                    Analyze uploaded images
                    clearly and intelligently.

                    Explain:
                    - screenshots
                    - diagrams
                    - notes
                    - handwritten content
                    - UI images
                    - study material
                    """
                },

                {
                    "role": "user",

                    "content": [

                        {
                            "type": "text",

                            "text":
                            """
                            Analyze this image in detail.
                            """
                        },

                        {
                            "type": "image_url",

                            "image_url": {

                                "url":
                                f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
        )

        answer = (

            response
            .choices[0]
            .message.content
        )

        return {

            "response": answer
        }

    except Exception as e:

        return {

            "error": str(e)
        }

# =========================================
# MUSIC SEARCH API
# =========================================

@app.get("/music")

def search_music(query: str):

    try:

        # API KEY

        api_key = os.getenv(
            "YOUTUBE_API_KEY"
        )

        # URL

        search_url = (
            "https://www.googleapis.com/youtube/v3/search"
        )

        # PARAMETERS

        params = {

            "part": "snippet",

            "q": query,

            "key": api_key,

            "maxResults": 1,

            "type": "video"
        }

        # REQUEST

        response = requests.get(

            search_url,

            params=params
        )

        data = response.json()

        # VIDEO ID

        video_id = (

            data["items"][0]
            ["id"]["videoId"]
        )

        # EMBED URL

        embed_url = (

            f"https://www.youtube.com/embed/{video_id}"
        )

        return {

            "success": True,

            "embed_url": embed_url
        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)
        }