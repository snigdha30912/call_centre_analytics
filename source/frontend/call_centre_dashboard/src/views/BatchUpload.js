import React, { useState, useEffect, useRef } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import RecordingList from "../components/RecordingList";
import RecordingAnalysis from "./RecordingAnalysis";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Input,
    Row,
    Col,
} from "reactstrap";
import { host } from "index";
function BatchUploadRecording() {
    const [recordings, setRecordings] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [status, setStatus] = useState('Connecting to Server...');
    const [fileName, setFileName] = useState("No file chosen");
    const uploadInputRef = useRef(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch(host + '/recordings').then((res) => {
            res.json().then((body) => {
                console.log(body)
                setRecordings(body.recordings)
            })
        })
    }, []);

    const handleUploadAudio = (e) => {
        e.preventDefault();
        const data = new FormData();
        console.log(uploadInputRef.current.files)
        // data.append('files', uploadInputRef.current.files);
        for (const key of Object.keys(uploadInputRef.current.files)) {
            data.append('file', uploadInputRef.current.files[key])
        }
        setLoading(true);
        setStatus('Uploading audio files...')

        fetch(host + '/batch-upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            console.log(response)
            response.json().then(async body => {
                console.log(body)
                let batch_url = body.batch_trans_url
                console.log(batch_url)
                let status = false;
                setStatus('Converting Speech to Text...')
                while (!status) {
                    let res = await fetch(host + '/batch-status', {
                        method: 'POST',
                        body: batch_url,
                    })
                    let body = await res.json()
                    status = body.status == 'Succeeded'

                }
                console.log(status)
                setStatus('Performing Sentiment Analysis...')

                fetch(host + '/batch-trans-results', {
                    method: 'POST',
                    body: batch_url,
                }).then(res => {
                    setStatus('Succeeded')
                    fetch(host + '/recordings').then((res) => {
                        res.json().then((body) => {
                            setRecordings(body.recordings);
                            setLoading(false);
                        })
                    })
                })



            })

        });
    }

    return (
        <>
            <div className="content">
                <div className="d-flex justify-content-center">
                    <Col md="8">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Upload a Recording</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Input type="text" readOnly={true} value={fileName}></Input>
                                <div style={{ display: "flex", paddingTop: "10px" }}>
                                    <label htmlFor="raised-button-file" style={{ marginRight: "10px" }} className="btn btn-info">
                                        Upload
                                    </label>
                                    <input style={{ display: "none" }} multiple={true} type="file" name="file" id="raised-button-file" ref={uploadInputRef} onChange={(e) => setFileName(e.target.files[0].name)} />
                                    <Button onClick={handleUploadAudio} className="btn-fill" color="primary" type="submit" component="span" >
                                        <span>Analyse</span>
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                        {loading ?
                            <div>
                                <LinearProgress color="primary" />
                                <p>{status}</p>
                            </div> :
                            <div></div>}
                    </Col>
                </div>
                <Row>
                    <RecordingList recordings={recordings} setActiveIndex={setActiveIndex} />
                </Row>
                {activeIndex != null && <RecordingAnalysis recording={recordings[activeIndex]} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
            </div>
        </>
    );
}

export default BatchUploadRecording;
