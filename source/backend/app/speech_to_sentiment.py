import azure.cognitiveservices.speech as speechsdk
import time
import json

import sentiment_analysis
import speaker_diarization
import wave
import contextlib
import text_summarization

done = False
def speech_to_sentiment(audio_file):
    filename = audio_file
    filename = speaker_diarization.speaker_separation(audio_file)
    speech_key, service_region = "81da1bd5ecd6489e9d954fd8234547b4","eastus"
    

    endpoint_string = "wss://{}.stt.speech.microsoft.com/speech/universal/v2".format(service_region)
    translation_config = speechsdk.translation.SpeechTranslationConfig(
        subscription=speech_key,
        endpoint=endpoint_string,
        speech_recognition_language='en-US',
        target_languages=('fr','en'))
    audio_config = speechsdk.audio.AudioConfig(filename=filename)

    translation_config.set_property(property_id=speechsdk.PropertyId.SpeechServiceConnection_SingleLanguageIdPriority, value='Accuracy')

    auto_detect_source_language_config = speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["mr-IN","hi-IN","en-IN"])

    recognizer = speechsdk.translation.TranslationRecognizer(
        translation_config=translation_config, 
        audio_config=audio_config,
        auto_detect_source_language_config=auto_detect_source_language_config)

    result = []
    def result_callback(event_type, evt):
        result.append(str(evt.result.translations['en']))



    def stop_cb(evt):
        global done
        done = True

    
    
    recognizer.session_started.connect(lambda evt: print('SESSION STARTED'))
    
    recognizer.recognized.connect(lambda evt: result_callback('RECOGNIZED', evt))
    recognizer.session_stopped.connect(stop_cb)
    recognizer.canceled.connect(stop_cb)

    def synthesis_callback(evt):
        """
        callback for the synthesis event
        """
        print('SYNTHESIZING {}\n\treceived {} bytes of audio. Reason: {}'.format(
            evt, len(evt.result.audio), evt.result.reason))
        if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
            print("RECOGNIZED: {}".format(evt.result.properties))
            if evt.result.properties.get(speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult) == None:
                print("Unable to detect any language")
            else:
                detectedSrcLang = evt.result.properties[speechsdk.PropertyId.SpeechServiceConnection_AutoDetectSourceLanguageResult]
                jsonResult = evt.result.properties[speechsdk.PropertyId.SpeechServiceResponse_JsonResult]
                detailResult = json.loads(jsonResult)
                startOffset = detailResult['Offset']
                duration = detailResult['Duration']
                if duration >= 0:
                    endOffset = duration + startOffset
                else:
                    endOffset = 0
                print("Detected language = " + detectedSrcLang + ", startOffset = " + str(startOffset) + " nanoseconds, endOffset = " + str(endOffset) + " nanoseconds, Duration = " + str(duration) + " nanoseconds.")
                global language_detected
                language_detected = True

    recognizer.synthesizing.connect(synthesis_callback)

    recognizer.start_continuous_recognition()

    while not done:
        time.sleep(.5)

    print(result)
    
    recognizer.stop_continuous_recognition()
    
    if len(result)>0:
        sentiments,breakdown_sentiments = sentiment_analysis.sentiment_analysis(result)
        summary = text_summarization.text_summarization(result)
    
    with contextlib.closing(wave.open(filename,'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)
        print(duration)
    
    return [result,sentiments,breakdown_sentiments,duration,summary]

