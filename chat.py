from langchain.chains import RetrievalQA
from langchain.indexes import VectorstoreIndexCreator
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI

from langchain.document_loaders import PyPDFLoader
loader = PyPDFLoader("/home/pavan/Downloads/FAQ_SWAYAM-1.pdf")
loaders = [loader]
documents = []
for loader in loaders:
    documents.extend(loader.load())
        <Route path="/chat" component={ChatBot}/> 

# split the documents into chunks
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)
# select which embeddings we want to use
embeddings = OpenAIEmbeddings()
# create the vectorestore to use as the index
db = Chroma.from_documents(texts, embeddings)
# expose this index in a retriever interface
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k":1})
# create a chain to answer questions 
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(), chain_type="stuff", retriever=retriever)
query = "who initiated swayam"
result = qa({"query": query})
print(result)