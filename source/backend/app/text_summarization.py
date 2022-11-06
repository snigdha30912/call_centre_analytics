from sentiment_analysis import key,endpoint
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

# Authenticate the client using your key and endpoint 
def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()

def text_summarization(document):
    return sample_extractive_summarization(client,document)
# Example method for summarizing text
def sample_extractive_summarization(client,document):
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.textanalytics import (
        TextAnalyticsClient,
        ExtractSummaryAction
    ) 
    
    # document = [
    #     "The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. "
    #     "These sentences collectively convey the main idea of the document. This feature is provided as an API for developers. " 
    #     "They can use it to build intelligent solutions based on the relevant information extracted to support various use cases. "
    #     "In the public preview, extractive summarization supports several languages. It is based on pretrained multilingual transformer models, part of our quest for holistic representations. "
    #     "It draws its strength from transfer learning across monolingual and harness the shared nature of languages to produce models of improved quality and efficiency. "
    # ]

    poller = client.begin_analyze_actions(
        document,
        actions=[
            ExtractSummaryAction(max_sentence_count=4)
        ],
    )

    document_results = poller.result()
    summary = []
    for result in document_results:
        extract_summary_result = result[0]
        [summary.append(str(sentence.text)) for sentence in extract_summary_result.sentences]
    s = ' '.join(summary)
    print(s)
    return s
    

