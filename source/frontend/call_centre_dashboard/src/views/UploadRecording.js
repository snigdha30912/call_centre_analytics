import React, { useState, useEffect, useRef } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import RecordingList from "../components/RecordingList";
import RecordingAnalysis from "./RecordingAnalysis";
import { host } from "index";
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

function UploadRecording() {
    const [recordings, setRecordings] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [status, setStatus] = useState('Connecting to Server...');
    const [fileName, setFileName] = useState("No file chosen");
    const [batchFileNames, setBatchFileNames] = useState("No files chosen");
    const singleUploadRef = useRef(null);
    const multiUploadRef = useRef(null);
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

    const handleSingleUpload = (e) => {

        e.preventDefault();
        const data = new FormData();
        data.append('file', singleUploadRef.current.files[0]);
        setLoading(true);
        setTimeout(() => {
            setStatus("Uploading Audio...")
        }, 2000);
        setTimeout(() => {
            setStatus("Converting Speech to Text...")
        }, 15000);
        setTimeout(() => {
            setStatus("Analyzing Sentiment...")
        }, 27000);
        setTimeout(() => {
            setStatus("Almost done...")
        }, 40000);
        fetch(host + '/upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            setStatus("Succeeded")
            fetch(host + '/recordings').then((res) => {
                res.json().then((body) => {
                    setRecordings(body.recordings);
                    setLoading(false);
                })
            })
        }).catch((err) => setStatus("Something went wrong"));
    }
    const handleBatchUpload = (e) => {
        e.preventDefault();
        const data = new FormData();
        console.log(multiUploadRef.current.files)
        // data.append('files', uploadInputRef.current.files);
        for (const key of Object.keys(multiUploadRef.current.files)) {
            data.append('file', multiUploadRef.current.files[key])
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
                    <Row style={{ width: "100%" }}>
                        <Col md="6" >
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Single Upload</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Input type="text" readOnly={true} value={fileName}></Input>
                                    <div style={{ display: "flex", paddingTop: "10px" }}>
                                        <label htmlFor="raised-button-file" style={{ marginRight: "10px" }} className="btn btn-info">
                                            Upload
                                        </label>
                                        <input style={{ display: "none" }} type="file" accept=".wav" name="file" id="raised-button-file" ref={singleUploadRef} onChange={(e) => setFileName(e.target.files[0].name)} />
                                        <Button onClick={handleSingleUpload} className="btn-fill" color="primary" type="submit" component="span" >
                                            <span>Analyse</span>
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Batch Upload</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Input type="text" readOnly={true} value={batchFileNames}></Input>
                                    <div style={{ display: "flex", paddingTop: "10px" }}>
                                        <label htmlFor="batch-raised-button-file" style={{ marginRight: "10px" }} className="btn btn-info">
                                            Upload
                                        </label>
                                        <input style={{ display: "none" }} multiple={true} accept=".wav" type="file" name="file" id="batch-raised-button-file" ref={multiUploadRef} onChange={(e) => setBatchFileNames([...e.target.files].map((f) => f.name).join(", "))} />
                                        <Button onClick={handleBatchUpload} className="btn-fill" color="primary" type="submit" component="span" >
                                            <span>Analyse</span>
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="12">
                            {loading ?
                                <div>
                                    <LinearProgress color="primary" />
                                    <p>{status}</p>
                                </div> :
                                <div></div>}
                        </Col>
                    </Row>

                </div>
                <Row>
                    <Col md="12">
                        <RecordingList recordings={recordings} setActiveIndex={setActiveIndex} />
                    </Col>
                </Row>
                {activeIndex != null && <RecordingAnalysis recording={recordings[activeIndex]} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
            </div>
        </>
    );
}

export default UploadRecording;
