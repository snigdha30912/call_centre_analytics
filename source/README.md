# CALL CENTRE ANALYTICS

## Problem
The problem being addressed is analysing various call recordings by converting speech to text and then performing sentiment analysis and estimating user satisfaction.

## Solution
1. Customers speak in their local languages, unable to understand by service providers. There is problem of customers’ queries and satisfaction, lack of awareness of service providers. 
2. Our application can be extensively used by service providers like bank of baroda who have huge call center network for customer queries and feedback.
3. We present an effective solution in which we take the call recordings, convert them into English text using various APIs of Azure and then perform sentiment analysis.
4. We perform end to end analysis of customer satisfaction and important KPIs to help analyse the calls and improve the services provided to customers.
5. A user dashboard is built where the performance indicator and growth is shown.

## Model Framework
1. The call recordings are added in the frontend dashboard and a POST request is sent to the backend.
2. Analysis of the recordings take place in the backend built in flask. Several Azure services are used which are described below.
  * `LanguageRecognizer` - Identifies the language of the audio Input.
  * `SpeechRecognizer` - Recognizes the Speech and converts it into text.
  * `Speaker Diarization` - To separate the voices of customers and service provider.
  * `Speech Translation` - Translating the speeches in other languages (Hindi, Marathi etc) to English.
  * `TextAnalytics` - Performing sentiment analytics on the converted text.
  * `Batch Transcription` - Storing multiple files in azure cloud and processing them concurrently to optimize the model.
  * `Text Summarization` - Brief summary of the recording.
  
  3. A centralized dashboard is created to analyse these recordings using React JS.
  
<img src="https://user-images.githubusercontent.com/58564764/200176408-29c5540c-f046-40bb-8951-e4f20ea98737.png" width=500>

## Centralized Dashboard
<img src="https://user-images.githubusercontent.com/58564764/200177037-f1063ecf-2e1e-4e97-a400-13fac9586b3b.png" width=700>

<img src="https://user-images.githubusercontent.com/58564764/200177106-995a4b24-e48d-4451-b002-3e6d6deaf738.png" width=700>

## Steps to run the code
1. Clone the above repository.
2. Create a virtual environment.
3. Navigate to the backend folder using `cd backend\app'.
4. Download the necessary libaries using `pip install -r requirements.txt`.
5. Start the backend server using `py app.py`.
6. Navigate to the frontend folder using `cd frontend\call_centre_dashboard`.
7. Install the libraries using `npm i`.
8. Start the local development server using `npm start`.


