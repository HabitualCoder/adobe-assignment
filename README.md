# 🚀 AI Leadership Insight Agent - Setup Guide

This application consists of a **Flask-based Python backend** using Langchain and Google Gemini, and a **React-Vite frontend** with a premium, minimalist design.

## 📁 Project Structure

- `backend/`: Python Flask application, AI logic, and documents.
- `frontend/`: React + Vite application with custom vanilla CSS.

---

## 🛠️ Step 1: Backend Setup

1. **Navigate to the backend directory.**
2. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
3. **Configure your API Key:**
   - Open `backend/.env`.
   - Replace `your_gemini_api_key_here` with your actual [Google Gemini API Key](https://aistudio.google.com/app/apikey).
4. **Run the backend server:**
   ```powershell
   python app.py
   ```
   *The server will run on `http://localhost:5000`.*

---

## 💻 Step 2: Frontend Setup

1. **Navigate to the frontend directory.**
2. **Install dependencies:**
   ```powershell
   npm install
   ```
3. **Run the development server:**
   ```powershell
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`.*

---

## 📄 Managing Documents

The AI agent bases its answers on the files inside `backend/documents/`. 
- To add more knowledge, simply drop `.txt` files into that folder.
- Restart the backend to re-index the new documents into the vector store.

---

## ✅ Key Features Implemented

- **RAG Architecture**: Uses FAISS for local vector storage and Google Gemini for grounding answers in provided text.
- **Premium UI**: Built with vanilla CSS for a high-end, responsive feel without external overhead.
- **Factual Grounding**: The system specifically looks for information in provided reports (Annual, Strategic, Departmental) before generating answers.
- **Micro-animations**: Included loading states and fade-in transitions for a smooth executive experience.
