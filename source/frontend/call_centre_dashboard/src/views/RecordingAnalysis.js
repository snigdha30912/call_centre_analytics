import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Table,
    Badge,
} from "reactstrap";
import { singleRecordingToChartData } from "variables/processData";
import { findOverallSentiment } from "variables/processData";
import { host } from "index";
function RecordingAnalysis({ recording, activeIndex, setActiveIndex }) {
    const [timeSentimentGraphType, setTimeSentimentGraphType] = useState(true) // true for stacked bar, false for line
    const chartData = singleRecordingToChartData(recording);
    const colors = {
        "positive": "success",
        "negative": "danger",
        "neutral": "info",
        "mixed": "warning"
    }
    console.log(recording.summary);
    useEffect(() => {
        setTimeout(() => {
            const table = document.getElementById("transcription");
            const summary = document.getElementById("summary");
            let ps = new PerfectScrollbar(table);
            ps = new PerfectScrollbar(summary);
        }, 1)
    }, [])
    return (
        <>
            <Modal
                modalClassName="modal-black"
                style={{
                    transform: "translate(12%,0%)",
                    maxWidth: "1120px"
                }}
                isOpen={activeIndex != null}
                toggle={() => setActiveIndex(null)}
            >
                <ModalHeader>
                    <h6 className="title d-inline">Recording Analysis</h6>
                    <button
                        aria-label="Close"
                        className="close"
                        onClick={() => setActiveIndex(null)}
                    >
                        <i className="tim-icons icon-simple-remove" />
                    </button>
                </ModalHeader>
                <ModalBody>
                    <div className="content">
                        <div className="d-flex justify-content-center">
                            <Row>
                                <Col md="5">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle style={{ fontWeight: "600" }} tag="h1">{recording.filename}</CardTitle>
                                            <CardTitle style={{ color: "lightgray" }} tag="h4">Overall Sentiment: {findOverallSentiment(recording.sentiments)}</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <audio style={{ width: "100%" }} controls src={`${host}/files/${recording.filename}`} />
                                        </CardBody>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <h5 className="card-category">Sentiment</h5>
                                            <CardTitle tag="h2">Overall Distribution</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Doughnut data={chartData['pieChartData']} />
                                        </CardBody>
                                    </Card>
                                    <Card style={{ height: "171px" }}>
                                        <CardHeader>
                                            <CardTitle tag="h2">Call Summary</CardTitle>
                                        </CardHeader>
                                        <CardBody >
                                            <div id="summary" style={{ maxHeight: "100%" }}>{recording.summary}</div>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col md="7">
                                    <Card className="card-tasks">
                                        <CardHeader>
                                            <CardTitle tag="h2">Call Transcription</CardTitle>
                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: "15px", padding: "0px 10px" }}>
                                                <h6>Text</h6>
                                                <h6>Sentiment</h6>
                                            </div>
                                        </CardHeader>
                                        <CardBody style={{ padddingTop: "0px" }}>
                                            <div id="transcription" className="table-full-width table-responsive" style={{ height: "100%" }}>
                                                <Table>
                                                    <tbody>
                                                        {recording.transcription.map((text, i) => (
                                                            <tr key={i}>
                                                                <td>
                                                                    <p style={{ textAlign: "justify" }}>
                                                                        {text}
                                                                    </p>
                                                                </td>
                                                                <td className="td-actions text-right" style={{ padding: "12px 10px" }}>
                                                                    <Badge color={colors[recording.sentiments[i]]} style={{ fontSize: '12px', padding: '8px' }}>
                                                                        {recording.sentiments[i]}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <Card className="card-chart">
                                        <CardHeader>
                                            <Row>
                                                <Col className="text-left" sm="6">
                                                    <h5 className="card-category">Sentiment</h5>
                                                    <CardTitle tag="h2">Sentiment as Call Progressed</CardTitle>
                                                </Col>
                                                <Col sm="6">
                                                    <ButtonGroup
                                                        className="btn-group-toggle float-right"
                                                        data-toggle="buttons"
                                                    >
                                                        <Button
                                                            tag="label"
                                                            className={classNames("btn-simple", {
                                                                active: timeSentimentGraphType
                                                            })}
                                                            color="info"
                                                            id="0"
                                                            size="sm"
                                                            onClick={() => setTimeSentimentGraphType(true)}
                                                        >
                                                            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                                Stacked Bar Graph
                                                            </span>
                                                            <span className="d-block d-sm-none">
                                                                <i className="tim-icons icon-single-02" />
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            color="info"
                                                            id="1"
                                                            size="sm"
                                                            tag="label"
                                                            className={classNames("btn-simple", {
                                                                active: !timeSentimentGraphType
                                                            })}
                                                            onClick={() => setTimeSentimentGraphType(false)}
                                                        >
                                                            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                                Line Graph
                                                            </span>
                                                            <span className="d-block d-sm-none">
                                                                <i className="tim-icons icon-gift-2" />
                                                            </span>
                                                        </Button>
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody>
                                            <Col xs="12">
                                                {timeSentimentGraphType ?
                                                    <Bar options={chartData['stackedBarOptions']} data={chartData['stackedBarData']} /> :
                                                    <Line data={chartData['lineChartData']} />
                                                }
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col md="6">

                            </Col>
                        </Row>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default RecordingAnalysis;
