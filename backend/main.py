from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from langchain.chains import RetrievalQA
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.document_loaders import PyPDFLoader

import PyPDF2
app = FastAPI()
origins = ['http://localhost:3000']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

retriever = None

def get_result(retriever, query):
    qa = RetrievalQA.from_chain_type(
        llm=OpenAI(), chain_type="stuff", retriever=retriever)
    result = qa({"query": query})
    return result['result']


def store_files(contents):
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
    texts = text_splitter.split_text(contents)
    embeddings = OpenAIEmbeddings()
    db = Chroma.from_texts(texts, embeddings)
    global retriever
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k":1})
  


@app.post("/upload")
async def upload_files(file: UploadFile):
    pdf = file.file
    pdf_reader = PyPDF2.PdfReader(pdf)

    contents = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        contents += page.extract_text()
    print(contents)

    store_files(contents)

@app.post("/query")
async def get_query_result(query: str):
    return get_result(retriever, query)