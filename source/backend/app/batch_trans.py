import requests

def create_transcription(file_urls):
  URL = "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions"

  headers = {
      "Content-Type":"application/json",
      "Ocp-Apim-Subscription-Key":"dc53890784c74e8483aa956bd6d7cbc9"
  }


  body = {
    "contentUrls": file_urls,
    "properties": {
      "diarizationEnabled": True,
      "wordLevelTimestampsEnabled": False,
      "punctuationMode": "DictatedAndAutomatic",
      "profanityFilterMode": "Masked"
    },
    "locale": "en-US",
    "displayName": "Transcription using default model for en-IN"
  }
    


  r = requests.post(url = URL, headers=headers,json=body)
    

  data = r.json()

  return data['self']


def check_batch_trans_status(URL):

  headers = {
      
      "Ocp-Apim-Subscription-Key":"dc53890784c74e8483aa956bd6d7cbc9"
  }

  r = requests.get(url = URL, headers=headers)
    

  data = r.json()
  return data['status']

def get_batch_trans_results(URL):

  url = str(URL,'UTF-8')+"/files"
  #url = URL
  headers = {
      
      "Ocp-Apim-Subscription-Key":"dc53890784c74e8483aa956bd6d7cbc9"
  }

  r = requests.get(url = url, headers=headers)
    

  data = r.json()
  return data