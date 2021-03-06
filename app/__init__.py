import pickle
import numpy as np
import os
# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

# Imports
import os
from flask import Flask, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Configure app
app = Flask(__name__, static_folder='frontend/dist', template_folder='frontend/')
app.config.from_object(os.environ["APP_SETTINGS"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
CORS(app)

# DB
db = SQLAlchemy(app)

# Import + Register Blueprints
from app.irsystem import irsystem as irsystem
app.register_blueprint(irsystem)

# React Catch All Paths
@app.route('/', methods=['GET'])
def index():
  return render_template('index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
	root_dir = os.path.dirname(os.getcwd())
	print app.static_folder
	# print send_from_directory(app.static_folder, path)
	return send_from_directory(app.static_folder, path, mimetype='application/font-sfnt')

utils_path = os.getcwd() + "/app/utils/"
# load_index()
valid_words_file = open(utils_path + "words.pkl","rb")
app.config['valid_words'] = pickle.load(valid_words_file)

idf_file = open(utils_path + "idf.pkl", "rb")
app.config['idfs'] = pickle.load(idf_file)

doc_norms_file = open(utils_path + "doc_norms.pkl", "rb")
app.config['doc_norms'] = pickle.load(doc_norms_file)

word_to_index_file = open(utils_path + "word_to_index.pkl","rb")
app.config['word_to_index'] = pickle.load(word_to_index_file)

index_to_word_file = open(utils_path + "index_to_word.pkl","rb")
app.config['index_to_word'] = pickle.load(index_to_word_file)

app.config['words_compressed'] = np.load(utils_path + "words_compressed.npy")
app.config['docs_compressed'] = np.load(utils_path + "docs_compressed.npy")