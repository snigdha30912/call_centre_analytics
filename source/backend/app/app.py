import os
import json
from flask import Flask, jsonify, session, request, send_from_directory
import speech_to_sentiment
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from batch_trans import *
from sentiment_analysis import sentiment_analysis
from text_summarization import text_summarization
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HELLO WORLD")

app = Flask(__name__)

## DATABASE SETUP
basedir = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    basedir, "database.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

## Recording Model
class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    transcription = db.Column(db.String(10000), unique=False, nullable=True)
    sentiments = db.Column(db.String(2000), unique=False, nullable=True)
    breakdown = db.Column(db.String(2000), unique=False, nullable=True)
    duration = db.Column(db.String(2000), unique=False, nullable=True)
    summary = db.Column(db.String(10000), unique=False, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Recording {self.filename}>"


UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = set(["wav"])

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/recordings")
@cross_origin()
def recordings():
    recordings = Recording.query.order_by(Recording.created_at.desc()).all()
    data = []
    for recording in recordings:
        data.append(
            {
                "filename": recording.filename,
                "transcription": json.loads(recording.transcription),
                "sentiments": json.loads(recording.sentiments),
                "breakdown": json.loads(recording.breakdown),
                "duration": json.loads(recording.duration),
                "summary": json.loads(recording.summary),
                "created_at": recording.created_at,
            }
        )
    return jsonify({"recordings": data, "count": len(data)})


@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "GET":
        # data = speech_to_sentiment.speech_to_sentiment("hindi.wav")
        return "Welcome to call centre api"


@app.route("/upload", methods=["POST"])
@cross_origin()
def fileUpload():
    target = os.path.join(os.getcwd(), UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files["file"]
    filename = secure_filename(file.filename)
    destination = "/".join([target, filename])
    file.save(destination)
    session["uploadFilePath"] = destination
    data = speech_to_sentiment.speech_to_sentiment(destination)
    recording = Recording(
        filename=filename,
        transcription=json.dumps(data[0]),
        sentiments=json.dumps(data[1]),
        breakdown=json.dumps(data[2]),
        duration=json.dumps(data[3]),
        summary=json.dumps(data[4]),
    )
    db.session.add(recording)
    db.session.commit()
    return jsonify(
        {
            "speech_to_text": data[0],
            "sentiment": data[1],
            "breakdown": data[2],
            "duration": data[3],
            "summary": data[4],
        }
    )


@app.route("/batch-upload", methods=["POST"])
@cross_origin()
def batchUpload():
    target = os.path.join(os.getcwd(), UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to batch upload`")
    # files = request.files["files"]
    uploaded_files = request.files.getlist("file")
    print(uploaded_files)

    content_urls = []
    for file in uploaded_files:
        print(file)
        filename = secure_filename(file.filename)
        destination = "/".join([target, filename])
        file.save(destination)
        session["uploadFilePath"] = destination
        url = 'https://call-centre-app.herokuapp.com/files/{filename}'
        content_urls.append(url)
    content_urls = [
        "https://call-centre-app.herokuapp.com/files/dataset_11.wav",
        "https://call-centre-app.herokuapp.com/files/dataset_13.wav",
        "https://call-centre-app.herokuapp.com/files/dataset_14.wav",
        "https://call-centre-app.herokuapp.com/files/dataset_15.wav"
    ]
    batch_trans_url = create_transcription(content_urls)
        
    return jsonify({"content_urls":content_urls,"batch_trans_url":batch_trans_url})

@app.route("/batch-status",methods=['POST'])
@cross_origin()
def check_status():
    url = request.data
    #url = 'https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/2a9a16ee-6588-44fa-8ed9-1d314dedcab3/'
    status = check_batch_trans_status(url)
    print(status)
    
    return jsonify({'status':status})

@app.route("/batch-trans-results",methods=['POST'])
@cross_origin()
def get_trans_results():
    url = request.data
    #url = 'https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/2a9a16ee-6588-44fa-8ed9-1d314dedcab3/files/'
    data = get_batch_trans_results(url)
    print(data)
    print(len(data['values']))
    trans_data = []
    for res_dict in data['values']:
        data = requests.get(res_dict['links']['contentUrl'])
        trans_data.append(data.json())
    trans_data.pop()
    print(len(trans_data))
    result = {}
    for data in trans_data:
        recognized_phrases = data['recognizedPhrases']
        speaker_diarized_data = []
        for phrases in recognized_phrases:
            if(phrases['speaker']==2):
                if(len(speaker_diarized_data)<10):
                    speaker_diarized_data.append(phrases['nBest'][0]['display'])
        if(len(speaker_diarized_data)==0):
            for phrases in recognized_phrases:
                if(phrases['speaker']==1):
                    if(len(speaker_diarized_data)<10):
                        speaker_diarized_data.append(phrases['nBest'][0]['display'])
        print(len(speaker_diarized_data))
        sentiments,breakdown_sentiments = sentiment_analysis(speaker_diarized_data)
        summary = text_summarization(speaker_diarized_data)
        filename = data['source'].split('/')[-1]
        duration = data['durationInTicks']/1e7
        recording = Recording(
            filename=filename,
            transcription=json.dumps(speaker_diarized_data),
            sentiments=json.dumps(sentiments),
            breakdown=json.dumps(breakdown_sentiments),
            duration=json.dumps(duration),
            summary=json.dumps(summary),
        )
        db.session.add(recording)
        db.session.commit()
        result[filename] ={
                "speech_to_text": speaker_diarized_data,
                "sentiment": sentiments,
                "breakdown": breakdown_sentiments,
                "duration": duration,
                "summary": summary,
            }
    
    print(result)
    return jsonify({'result':result})




@app.route("/files/<path:filename>")
@cross_origin()
def download_file(filename):
    return send_from_directory("uploads/", filename)


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True)
