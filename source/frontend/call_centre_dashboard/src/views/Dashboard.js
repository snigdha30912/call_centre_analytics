import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Line, Doughnut, Scatter } from "react-chartjs-2";
import ReactWordcloud from 'react-wordcloud';
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import { recordingsToChartData } from "../variables/processData";
import KpiDescription from "./KpiDescription";
import { host } from "index";
function Dashboard(props) {
  const [wordCloudType, setWordCloudType] = useState(true); // true : positive, false : negative
  const [performanceChartType, setPerformanceChartType] = useState(true); //true : monthly, false : daily
  const [chartData, setChartData] = useState(null);
  const [recordings, setRecordings] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [graphActiveIndex, setGraphActiveIndex] = useState(null);

  useEffect(() => {
    fetch(host + '/recordings').then((res) => {
      res.json().then((body) => {
        console.log(body)
        setRecordings(body.recordings)
        setChartData(recordingsToChartData(body.recordings))
      })
    })
  }, []);
  return (
    <>
      <div className="content">
        <Row >
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Overall Sentiment</h5>
                    <CardTitle tag="h2">Call Centre Performance</CardTitle>
                  </Col>
                  <Col sm="2">
                    <Button
                      color="info"
                      id="id"
                      size="sm"
                      title=""
                      type="button"
                      onClick={() => setGraphActiveIndex(2)}
                      style={{ marginRight: 30 }}
                    >
                      <i className="tim-icons icon-bulb-63" />
                    </Button>
                  </Col>
                  <Col sm="4">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: performanceChartType
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setPerformanceChartType(true)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Monthly
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
                          active: !performanceChartType
                        })}
                        onClick={() => setPerformanceChartType(false)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Daily
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
                <div className="chart-area">
                  {chartData ? <Line
                    data={performanceChartType ? chartData["performanceDataMonthly"] : chartData["performanceDataDaily"]}
                    options={chartData["performanceDataOptions"]}
                  /> : "Loading"}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="10">
                    <h5 className="card-category">KPI: CALL QUALITY INDEX</h5>
                  </Col>
                  <Col sm="2">
                    <Button
                      color="info"
                      id="id"
                      size="sm"
                      title=""
                      type="button"
                      onClick={() => setGraphActiveIndex(1)}
                    >
                      <i className="tim-icons icon-bulb-63" />
                    </Button>
                  </Col>
                </Row>
                <CardTitle tag="h3">
                  {/* <i className="tim-icons icon-bell-55 text-info" />  */}
                  Overall Sentiment Vs Recording Duration
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {chartData ? <Scatter data={chartData['scatterchart']} options={chartData['scatteroptions']} /> : "Loading"}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="10">
                    <h5 className="card-category">KPI : CUSTOMER SATISFACTION (CSAT)</h5>
                    <CardTitle tag="h3">
                      {/* <i className="tim-icons icon-bell-55 text-info" />  */}
                      Sentiment Distribution
                    </CardTitle>
                  </Col>
                  <Col sm="2">
                    <Button
                      color="info"
                      id="id"
                      size="sm"
                      title=""
                      type="button"
                      onClick={() => setGraphActiveIndex(0)}
                    >
                      <i className="tim-icons icon-bulb-63" />
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div>
                  {chartData ? <Doughnut data={chartData['pieChartData']} /> : "Loading"}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-chart" style={{ height: "490px" }}>
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Sentiment</h5>
                    <CardTitle tag="h2">Word Cloud</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: wordCloudType
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setWordCloudType(true)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Positive
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
                          active: !wordCloudType
                        })}
                        onClick={() => setWordCloudType(false)}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Negative
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
                {chartData ? <ReactWordcloud options={{
                  fontSizes: [20, 40]
                }} words={wordCloudType ? chartData['positiveWordCloudData'] : chartData['negativeWordCloudData']} /> : "Loading"}
              </CardBody>
            </Card>
          </Col>
        </Row>
        {graphActiveIndex != null && <KpiDescription graphActiveIndex={graphActiveIndex} setGraphActiveIndex={setGraphActiveIndex} />}
      </div>
    </>
  );
}

export default Dashboard;
