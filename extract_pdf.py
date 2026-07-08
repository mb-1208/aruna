import fitz
import sys

try:
    doc = fitz.open("Copywriting_Aruna.pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    
    with open("C:\\Users\\mbntn\\.gemini\\antigravity-ide\\brain\\8be69079-4667-4624-93b5-d8e1dd757bca\\scratch\\pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully extracted text")
except Exception as e:
    print("Error:", e)
