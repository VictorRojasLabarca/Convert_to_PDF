import os
import uuid
from docx import Document
from fpdf import FPDF

from flask import abort, render_template, request, send_file
from flask_app import app


#config root for temp file
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file uploaded", 400
    
    file = request.files['file']
    if file.filename == '':
        return "No file Selected", 400
    
    if file and file.filename.endswith('.docx'):
        #Save file .docx
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        #Create name unique for file pdf
        unique_filename = f"{uuid.uuid4().hex}.pdf"
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

        try:
            #Convert docx to pdf
            convert_docx_to_pdf(file_path, pdf_path)
            #Return file pdf
            return send_file(os.path.abspath(pdf_path), as_attachment=True)
        except Exception as e:
            print(f"Error converting file: {e}")
            abort(500, description="Error converting file")
        finally:
            #delete file temp
            if os.path.exists(file_path):
                os.remove(file_path)

    return "Invalid file format", 400

def convert_docx_to_pdf(docx_path, pdf_path):
    #Read docx file
    print(f"Converting {docx_path} to {pdf_path}...")
    doc = Document(docx_path)

    #Create object pdf
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    #Convert paragraph from docx to pdf
    for paragraph in doc.paragraphs:
        text = paragraph.text.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'")
        pdf.multi_cell(0, 10, text)
    
    #Save pdf file
    pdf.output(pdf_path)
    print(f"File saved: {pdf_path}")

    #Ckeck file exists
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File {pdf_path} not found")