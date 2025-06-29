#  Gaucho AI Marketing

A self-improving, low-cost, fully automated AI agentic system for SMB marketing

⸻

## Overview

Gaucho AI Marketing is an end-to-end marketing automation platform built for small and medium businesses (SMBs). It addresses a common, persistent problem:

"Marketing is hard. It's time-consuming. And we don't know what to post, when, or where."

Unlike generic tools (e.g., ChatGPT, Gemini) or expensive agencies, Gaucho AI strikes the perfect middle ground: a smart, scalable AI system that remembers brand identity, adapts to changing input quality, generates channel-specific content, and improves autonomously over time.

🌐 Live Demo: https://gaucho-marketing-ai.vercel.app/projects

⸻

## Core Features

- 🧠 **Brand-aware Content Generation**
  - Ingests brand assets (text, image, audio/video)
  - Builds a Retrieval-Augmented Generation (RAG) knowledge base
  - Captures tone, style, and voice from a single "owner chat"
- 🗓️ **Automated Scheduling + Posting**
  - Generates platform-specific (Instagram, LinkedIn, etc.) posts
  - Auto-schedules and posts using APIs (in dev)
- 📊 **Analytics & Feedback Loop**
  - Monitors post performance
  - Uses data to guide future generation
- 🔁 **Self-Improving Agent Architecture**
  - Every run is logged
  - LLM-based Evaluator scores performance
  - Reviser agent updates agents/prompts without human intervention
  - Inspired by the AlphaGo-style training loop and Sutton's "Bitter Lesson"

⸻

## 🏗️ Architecture

Gaucho AI Marketing employs a multi-component architecture designed for scalability and efficient content generation:

1.  **Frontend (Next.js):** A modern web interface built with Next.js and React, allowing users to manage projects, upload brand assets, define prompts, and view generated content.
2.  **Backend API (Next.js API Routes):** Handles user authentication, project management, asset metadata storage, and communication with the Asset Processing Service and AI models.
3.  **Asset Processing Service (Python):** A separate asynchronous service responsible for handling multimedia assets. It performs tasks like audio extraction from videos (using `ffmpeg-python`) and transcription.
4.  **AI Core:**
    - **Transcription Engine:** Utilizes OpenAI's Whisper-1 model for accurate speech-to-text conversion of audio and video assets.
    - **Content Generation Engine:** Leverages powerful Large Language Models (LLMs) like GPT-4o (with fallback to GPT-4o-mini) to generate marketing copy based on user prompts and the RAG knowledge base derived from brand assets.
5.  **Database (PostgreSQL):** Stores all persistent data, including user information, project details, brand assets (metadata and transcribed content), user-defined prompts, and generated marketing content.
6.  **RAG Knowledge Base:** Constructed by ingesting and processing various brand assets (text, images, audio/video transcripts). This knowledge base provides context to the LLMs, enabling them to generate content that is deeply aligned with the brand's identity, tone, and style. The system captures nuanced brand voice characteristics from an "owner chat" feature.

The platform emphasizes a self-improving loop where generated content performance (monitored via analytics) feeds back into the system. An LLM-based Evaluator scores performance, and a Reviser agent can autonomously update prompts and agent configurations to enhance future outputs, inspired by reinforcement learning principles like those in AlphaGo and Sutton's "Bitter Lesson."

⸻

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend & API:** Next.js API Routes, Node.js
- **Asset Processing Service:** Python, Poetry (for dependency management), `ffmpeg-python`
- **AI Models & Libraries:**
  - OpenAI GPT-4o, GPT-4o-mini (for content generation)
  - OpenAI Whisper-1 (for audio transcription)
  - `tiktoken` (for token counting and management)
- **Database:** PostgreSQL
- **Deployment:** Vercel (for Next.js application)

⸻

## ⚙ Technical Deep Dive

### I. Asset Ingestion and Processing

- **Upload:** Users upload assets (video, audio, text) via the Next.js frontend.
- **Asynchronous Processing:** The `asset-processing-service` (Python) handles these uploads asynchronously. It uses `ffmpeg-python` for media manipulation, such as extracting audio from video files.
- **Transcription:** Audio data is transcribed using OpenAI's Whisper-1 model. Whisper-1 is a Transformer-based model that converts audio spectrograms into text, handling multiple languages and punctuation.
- **Storage:** Transcribed text and asset metadata (including `tokenCount` calculated via `tiktoken`) are stored in the PostgreSQL `assetsTable`.

### II. Content Generation Pipeline

1.  **Prompt Management:**
    - Users create custom prompts or import templates (stored in `promptsTable`).
    - Example prompts are available in the `resources/` directory.
2.  **Context Aggregation:** Content from all relevant project assets is concatenated to form a comprehensive summary (`contentFromAssets`).
3.  **LLM Invocation:**
    - For each user prompt, a request is sent to the OpenAI API. The payload includes the user's prompt and the aggregated asset summary.
    - The system prioritizes GPT-4o, with an automatic fallback to GPT-4o-mini in case of API errors (e.g., 503, 429).
4.  **Token Management:**
    - `tiktoken` is used for precise token counting.
    - The system enforces `MAX_TOKENS_PROMPT` (e.g., 20000) and `MAX_TOKENS_ASSETS` to stay within API limits and manage costs. Token counts are validated before API calls.
5.  **Output Storage:** Generated content is saved in the `generatedContentTable`, linked to the project, the originating prompt, and includes an ordering field.

### III. Self-Improvement Mechanism (Conceptual)
![Screenshot 2025-06-03 at 11 14 21 PM](https://github.com/user-attachments/assets/4eb46c99-cf94-4377-aa0b-b029f5533d8f)


- **Logging:** All generation runs, prompts, and outputs are logged.
- **Evaluation:** An LLM-based "Evaluator" agent is designed to score the quality and effectiveness of generated content against defined metrics.
- **Revision:** A "Reviser" agent analyzes evaluation scores and can autonomously fine-tune prompts or agent configurations to improve future performance. This creates a continuous learning loop.

⸻

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) and npm/yarn
- Python (v3.9+) and Poetry
- PostgreSQL server
- OpenAI API Key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gaucho-ai-marketing.git
cd gaucho-ai-marketing
```

### 2. Setup Frontend & Backend API (Next.js)

```bash
cd nextjs
npm install
# Create .env.local and add your OpenAI API key and PostgreSQL connection string
# Example:
# OPENAI_API_KEY=your_openai_api_key
# POSTGRES_URL=postgresql://user:password@host:port/database
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
# NEXT_PUBLIC_ASSET_PROCESSING_API_URL=http://localhost:8000
npm run dev
```

The application should be running on `http://localhost:3000`.

### 3. Setup Asset Processing Service (Python)

```bash
cd ../asset-processing-service
poetry install
# Create a .env file and add necessary configurations (if any, e.g., for worker settings)
# Example for OPENAI_API_KEY if the service calls OpenAI directly, or other service-specific vars
# OPENAI_API_KEY=your_openai_api_key
poetry run uvicorn asset_processing_service.main:app --reload --port 8000
# (Assuming the main FastAPI app instance is in main.py and named 'app')
# Adjust the run command based on your Python service's entry point (e.g., Flask, FastAPI).
```

The service should be running on `http://localhost:8000`.

### 4. Database Setup

- Ensure your PostgreSQL server is running.
- Create the necessary database and tables. You might need to run database migrations (details depend on the project's migration setup, e.g., using Prisma, TypeORM, or custom SQL scripts).
  - Key tables: `assetsTable`, `promptsTable`, `generatedContentTable`, `projectsTable`, `usersTable`, etc.

### 5. Environment Variables

Ensure all necessary environment variables are configured in the respective `.env` or `.env.local` files for both the Next.js application and the Python asset processing service. This includes API keys, database connection strings, and service URLs.

⸻

## 💡 Usage

1.  **Register/Login:** Access the platform via your browser.
2.  **Create a Project:** Start a new marketing project.
3.  **Upload Brand Assets:** Add relevant documents, images, audio, or video files that define your brand. The system will process these to build its knowledge base.
4.  **Configure Prompts:** Define specific prompts for the types of content you want to generate (e.g., "Write a LinkedIn post about our new product launch," "Create an Instagram caption for this image"). You can use templates or create your own.
5.  **Generate Content:** Run the generation process. The AI will use your assets and prompts to create marketing copy.
6.  **Review & Iterate:** Review the generated content. Use the platform's feedback mechanisms to help the system improve over time.

---
