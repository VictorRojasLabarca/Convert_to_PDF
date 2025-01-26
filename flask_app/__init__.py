import os
from flask import Flask
from dotenv import load_dotenv

#Configurations
load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv('APP_SECRET_KEY')
