import { removeStopwords } from "remove-stopwords"
export const sentimentColor = (sentiment, opacity = 1) => {
    return {
        "positive": `rgba(0,242,195,${opacity})`,
        "negative": `rgba(253,93,147,${opacity})`,
        "neutral": `rgba(29,140,248,${opacity})`,
        "mixed": `rgba(255,141,114,${opacity})`,
    }[sentiment]
}

export const recordingsToChartData = (recordings) => {
    const chartData = {}
    let scatterchartdata = {
        'positive': [],
        'negative': [],
        'neutral': [],
        'mixed': []
    }
    for (let recording of recordings) {
        let n = recording.sentiments.length
        let x = recording.duration
        let pos = 0.0
        let neg = 0.0
        let mix = 0.0
        let neu = 0.0
        for (let sentiment of recording.sentiments) {
            if (sentiment === 'positive')
                pos = pos ? pos + 1 / n : 1 / n;
            else if (sentiment === 'negative')
                neg = neg ? neg + 1 / n : 1 / n;
            else if (sentiment === 'neutral')
                neu = neu ? neu + 1 / n : 1 / n;
            else if (sentiment === 'mixed')
                mix = mix ? mix + 1 / n : 1 / n;
        }

        scatterchartdata['positive'].push({ 'x': x, 'y': pos });
        scatterchartdata['negative'].push({ 'x': x, 'y': neg });
        scatterchartdata['neutral'].push({ 'x': x, 'y': neu });
        scatterchartdata['mixed'].push({ 'x': x, 'y': mix });
    }

    chartData['scatterchart'] = {
        datasets: [
            {
                label: "Positive",
                data: scatterchartdata['positive'],
                backgroundColor: 'rgba(75, 192, 192,1)',
            },
            {
                label: "Negative",
                data: scatterchartdata['negative'],
                backgroundColor: 'rgba(255, 99, 132,1)',
            },
            {
                label: "Neutral",
                data: scatterchartdata['neutral'],
                backgroundColor: 'rgba(255, 206, 86,1)',
            },
            {
                label: "Mixed",
                data: scatterchartdata['mixed'],
                backgroundColor: 'rgba(54, 162, 235,1)',
            },
        ],
    };
    chartData['scatteroptions'] = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    let piData = {};

    for (let recording of recordings) {
        let n = recording.sentiments.length
        for (let sentiment of recording.sentiments)
            piData[sentiment] = piData[sentiment] ? piData[sentiment] + 1 / n : 1 / n;
    }
    chartData['pieChartData'] = {
        labels: ['neutral', 'mixed', 'positive', 'negative'],
        datasets: [
            {
                label: 'Overall Sentiment',
                data: [
                    piData['neutral'] / recordings.length * 100,
                    piData['mixed'] / recordings.length * 100,
                    piData['positive'] / recordings.length * 100,
                    piData['negative'] / recordings.length * 100
                ],
                backgroundColor: [
                    sentimentColor('neutral', 0.6),
                    sentimentColor('mixed', 0.6),
                    sentimentColor('positive', 0.6),
                    sentimentColor('negative', 0.6),
                ],
                borderColor: [
                    sentimentColor('neutral'),
                    sentimentColor('mixed'),
                    sentimentColor('positive'),
                    sentimentColor('negative'),

                ],
                borderWidth: 1,
            },
        ],
    };

    const positiveWordCloud = {};
    const negativeWordCloud = {};

    for (let recording of recordings) {
        recording.transcription.map((transcription, idx) => {
            let words = removeStopwords(transcription.split(' '));
            if (recording.sentiments[idx] === "positive") {
                for (let word of words) {
                    word = word.replace(/[^a-zA-Z#]/, " ")
                    positiveWordCloud[word] = positiveWordCloud[word] ? positiveWordCloud[word] + 1 : 1;
                }
            }
            if (recording.sentiments[idx] === "negative") {
                for (let word of words) {
                    word = word.replace(/[^a-zA-Z#]/, " ")
                    negativeWordCloud[word] = negativeWordCloud[word] ? negativeWordCloud[word] + 1 : 1;
                }
            }
        })
    }
    chartData["positiveWordCloudData"] = Object.entries(positiveWordCloud).map(([key, value]) => {
        return {
            "text": key,
            "value": value
        }
    })
    chartData["negativeWordCloudData"] = Object.entries(negativeWordCloud).map(([key, value]) => {
        return {
            "text": key,
            "value": value
        }
    })

    const positiveDatasetMonthly = [0.32, .35, .40, .58, .62, .65, .60, .57, .68, .73, .70, .72];
    const negativeDatasetMonthly = [0.56, .50, .35, .21, .18, .19, .23, .16, .17, .15, .13, .14];
    const neutralDatasetMonthly = [0.05, .02, .09, .01, .06, .09, .06, .04, .08, .08, .06, .05];
    const mixedDatasetMonthly = positiveDatasetMonthly.map((pos, idx) => 1 - pos - negativeDatasetMonthly[idx] - neutralDatasetMonthly[idx]);
    const positiveDatasetDaily = [0.56, .50, .35, .21, .18, .19, .23, .16, .17, .15, .13, .14, 0.32, .35, .40, .58, .62, .65, .60, .57, .68, .73, .70, .72];
    const negativeDatasetDaily = [0.32, .35, .40, .58, .62, .65, .60, .57, .68, .73, .70, .72, 0.56, .50, .35, .21, .18, .19, .23, .16, .17, .15, .13, .14];
    const neutralDatasetDaily = [0.05, .02, .09, .01, .06, .09, .06, .04, .08, .08, .06, .05, 0.05, .02, .09, .01, .06, .09, .06, .04, .08, .08, .06, .05];
    const mixedDatasetDaily = positiveDatasetDaily.map((pos, idx) => 1 - pos - negativeDatasetDaily[idx] - neutralDatasetDaily[idx]);
    chartData["performanceDataOptions"] = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [
                {
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(29,140,248,0.0)",
                        zeroLineColor: "transparent"
                    },
                    ticks: {
                        suggestedMin: 60,
                        suggestedMax: 125,
                        padding: 20,
                        fontColor: "#9a9a9a"
                    }
                }
            ],
            xAxes: [
                {
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(29,140,248,0.1)",
                        zeroLineColor: "transparent"
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "#9a9a9a"
                    }
                }
            ]
        }
    };

    chartData["performanceDataMonthly"] = {
        labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ],
        datasets: [
            {
                label: "Positive",
                fill: true,
                borderColor: sentimentColor("positive"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("positive"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("positive"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: positiveDatasetMonthly
            },
            {
                label: "Negative",
                fill: true,
                borderColor: sentimentColor("negative"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("negative"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("negative"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: negativeDatasetMonthly
            },
            {
                label: "Neutral",
                fill: true,
                borderColor: sentimentColor("neutral"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("neutral"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("neutral"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: neutralDatasetMonthly
            },
            {
                label: "Mixed",
                fill: true,
                borderColor: sentimentColor("mixed"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("mixed"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("mixed"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: mixedDatasetMonthly
            }
        ]
    };
    chartData["performanceDataDaily"] = {
        labels: [
            "10 OCT",
            "11 OCT",
            "12 OCT",
            "13 OCT",
            "14 OCT",
            "15 OCT",
            "16 OCT",
            "17 OCT",
            "18 OCT",
            "19 OCT",
            "20 OCT",
            "21 OCT",
            "22 OCT",
            "23 OCT",
            "24 OCT",
            "25 OCT",
            "26 OCT",
            "27 OCT",
            "28 OCT",
            "29 OCT",
            "30 OCT",
            "31 OCT",
            "01 NOV",
            "02 NOV"
        ],
        datasets: [
            {
                label: "Positive",
                fill: true,
                borderColor: sentimentColor("positive"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("positive"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("positive"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: positiveDatasetDaily
            },
            {
                label: "Negative",
                fill: true,
                borderColor: sentimentColor("negative"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("negative"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("negative"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: negativeDatasetDaily
            },
            {
                label: "Neutral",
                fill: true,
                borderColor: sentimentColor("neutral"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("neutral"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("neutral"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: neutralDatasetDaily
            },
            {
                label: "Mixed",
                fill: true,
                borderColor: sentimentColor("mixed"),
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: sentimentColor("mixed"),
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: sentimentColor("mixed"),
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: mixedDatasetDaily
            }
        ]
    };
    return chartData;
}

export const singleRecordingToChartData = (recording) => {
    const chartData = {};
    let piData = {};
    for (let sentiment of recording.sentiments)
        piData[sentiment] = piData[sentiment] ? piData[sentiment] + 1 : 1;

    chartData['pieChartData'] = {
        labels: ['neutral', 'mixed', 'positive', 'negative'],
        datasets: [
            {
                label: 'Overall Sentiment',
                data: [
                    piData['neutral'] / recording.sentiments.length * 100,
                    piData['mixed'] / recording.sentiments.length * 100,
                    piData['positive'] / recording.sentiments.length * 100,
                    piData['negative'] / recording.sentiments.length * 100
                ],
                backgroundColor: [
                    sentimentColor('neutral', 0.6),
                    sentimentColor('mixed', 0.6),
                    sentimentColor('positive', 0.6),
                    sentimentColor('negative', 0.6),
                ],
                borderColor: [
                    sentimentColor('neutral'),
                    sentimentColor('mixed'),
                    sentimentColor('positive'),
                    sentimentColor('negative'),

                ],
                borderWidth: 1,
            },
        ],
    };

    let barData = {}
    barData["positive"] = [];
    barData["neutral"] = [];
    barData["negative"] = [];
    for (let i = 0; i < recording.breakdown.length; i++) {
        barData["positive"].push(recording.breakdown[i][0])
        barData["neutral"].push(recording.breakdown[i][1])
        barData["negative"].push(recording.breakdown[i][2])
    }

    let interval = recording.duration / recording.sentiments.length
    let labels = []
    for (let i = 0; i < recording.sentiments.length - 2; i++) {
        let start = i * interval
        let end = (i + 1) * interval
        console.log(start, end)
        let s = String(start.toFixed(1)) + " - " + String(end.toFixed(1))
        labels.push(s)
    }
    chartData['stackedBarData'] = {
        labels,
        datasets: [
            {
                label: 'positive',
                data: barData['positive'],
                backgroundColor: sentimentColor('positive'),
            },
            {
                label: 'neutral',
                data: barData['neutral'],
                backgroundColor: sentimentColor('neutral'),
            },
            {
                label: 'negative',
                data: barData['negative'],
                backgroundColor: sentimentColor('negative'),
            },
        ],
    };
    chartData['stackedBarOptions'] = {
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };
    chartData['lineChartData'] = {
        labels,
        datasets: [
            {
                label: 'Positive sentiment',
                data: barData['positive'],
                backgroundColor: sentimentColor('positive'),
                borderColor: sentimentColor('positive'),
            },
            {
                label: 'Negative sentiment',
                data: barData['negative'],
                backgroundColor: sentimentColor('negative'),
                borderColor: sentimentColor('negative')
            },
            {
                label: 'Neutral sentiment',
                data: barData['neutral'],
                backgroundColor: sentimentColor('neutral'),
                borderColor: sentimentColor('neutral'),
            },
        ]
    }
    return chartData;
}

export const findOverallSentiment = (sentiments) => {
    const sentimentCount = {};
    let maxCount = 0;
    let overallSentiment = "";
    for (let sentiment of sentiments) {
        sentimentCount[sentiment] = sentimentCount[sentiment] ? sentimentCount[sentiment] + 1 : 1;
        if (sentimentCount[sentiment] > maxCount) {
            maxCount = sentimentCount[sentiment];
            overallSentiment = sentiment;
        }
    }
    return overallSentiment;
}

