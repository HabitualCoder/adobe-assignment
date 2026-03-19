import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Langchain imports
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend requests
CORS(app)

# Configuration
DOCUMENTS_PATH = os.path.join(os.path.dirname(__file__), "documents")
DB_FAISS_PATH = "vectorstore/db_faiss"

# Global variable for the QA chain
qa_chain = None

def init_qa_chain():
    """Initializes the vector store and the QA chain."""
    global qa_chain
    
    # 1. Load Documents
    # Supports .txt and .pdf (via pypdf)
    loader = DirectoryLoader(DOCUMENTS_PATH, glob="*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    # 2. Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    texts = text_splitter.split_documents(documents)
    
    # 3. Create Embeddings & Vector Store
    # Note: Requires GOOGLE_API_KEY environment variable
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    vectorstore = FAISS.from_documents(texts, embeddings)
    vectorstore.save_local(DB_FAISS_PATH)
    
    # 4. Initialize LLM (Gemini)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    
    # 5. Create RetrievalQA Chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True
    )

@app.route("/api/query", methods=["POST"])
def query():
    global qa_chain
    if qa_chain is None:
        try:
            init_qa_chain()
        except Exception as e:
            return jsonify({"error": f"Failed to initialize AI: {str(e)}"}), 500
            
    data = request.json
    question = data.get("question")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400
        
    try:
        response = qa_chain.invoke({"query": question})
        answer = response["result"]
        sources = [doc.metadata.get("source", "Unknown") for doc in response["source_documents"]]
        
        return jsonify({
            "answer": answer,
            "sources": list(set([os.path.basename(s) for s in sources]))
        })
    except Exception as e:
        return jsonify({"error": f"Error processing query: {str(e)}"}), 500

@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Backend is running", "model": "Gemini-1.5-Flash"})

if __name__ == "__main__":
    # Create the vectorstore directory if it doesn't exist
    if not os.path.exists("vectorstore"):
        os.makedirs("vectorstore")
        
    # Check if API Key is set
    if not os.getenv("GOOGLE_API_KEY"):
        print("WARNING: GOOGLE_API_KEY is not set in the environment.")
        
    app.run(host="0.0.0.0", port=5000, debug=True)
