import React, { useState, useRef } from "react";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import LinearProgress from '@mui/material/LinearProgress';
import classNames from "classnames";

// reactstrap components
import {
    Alert,
    UncontrolledAlert,
    Button,
    ButtonGroup,
    FormGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Input,
    Row,
    Col,
    Table,
    Badge
} from "reactstrap";

function MultipleFileUpload() {
    const [audioURL, setAudioURL] = useState('');
    const [fileName, setFileName] = useState("No file chosen");
    const uploadInputRef = useRef(null);
    const [result, setResult] = useState(null);



    const handleUploadAudio = (e) => {
        e.preventDefault();
        const data = new FormData();
        console.log(uploadInputRef.current.files)
        // data.append('files', uploadInputRef.current.files);
        for (const key of Object.keys(uploadInputRef.current.files)) {
            data.append('file', uploadInputRef.current.files[key])
        }
        console.log(data)
        fetch('https://call-centre-app.herokuapp.com/batch-upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            console.log(response)
            response.json().then(async body => {
                console.log(body)
                let batch_url = body.batch_trans_url
                console.log(batch_url)
                let status = false;

                while (!status) {
                    let res = await fetch('http://127.0.0.1:5000/batch-status', {
                        method: 'POST',
                        body: batch_url,
                    })
                    let body = await res.json()
                    status = body.status == 'Succeeded'

                }
                console.log(status)

                fetch('http://127.0.0.1:5000/batch-trans-results', {
                    method: 'POST',
                    body: batch_url,
                }).then(res => {
                    res.json().then((body) => {
                        console.log(body)
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
                                <CardTitle tag="h4">Analyse a Recording</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div>

                                    <label htmlFor="raised-button-file">
                                        <Button className="cursor-pointer">
                                            Upload
                                        </Button>
                                    </label>
                                    <input style={{ opacity: 0, position: "absolute", top: 80, left: 30 }} multiple={true} type="file" name="file" id="raised-button-file" ref={uploadInputRef} />
                                    <span style={{ color: "white" }}>{uploadInputRef?.current?.files[0]?.name}</span>: <span></span>
                                </div>
                                <Button onClick={handleUploadAudio} className="btn-fill" color="primary" type="submit" component="span" >
                                    <span>Analyse</span>
                                </Button>
                            </CardBody>
                        </Card>

                    </Col>
                </div>


            </div>
        </>
    );
}

export default MultipleFileUpload;



