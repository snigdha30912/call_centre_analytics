import React, { useEffect, useState } from "react";
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

function KpiDescription({ graphActiveIndex, setGraphActiveIndex }) {
    var description_list = ["Customer Satisfaction (CSAT) is a very commonly used CX metric to determine how satisfied customers are with your company's products or services. Here we have created a pi chart showing the overall sentiment of all the recordings.",
                            "We show a scatter plot of overall sentiment and call duration. In general a call duration of less than 5 minutes is considered appropriate for a good call. So a call having a positive score of greater than 0.5 and recording duration less than 5 minutes is considered satisfactory.",
                            "The Overall Performance Graph shows the evolution of overall customer sentiment with time. It can be used to analyze the overall performance of the call centre."];
    return (
        <>
            <Modal
                modalClassName="modal-black"
                style={{
                    transform: "translate(12%,0%)",
                    maxWidth: "1120px"
                }}
                isOpen={graphActiveIndex != null}
                toggle={() => setGraphActiveIndex(null)}
            >
                <ModalHeader>
                    <div>KPI description</div>
                    <button
                        aria-label="Close"
                        className="close"
                        onClick={() => setGraphActiveIndex(null)}
                    >
                        <i className="tim-icons icon-simple-remove" />
                    </button>
                </ModalHeader>
                <ModalBody>
                    <div className="content">
                        <div className="d-flex justify-content-center">
                            
                                    <Card>
                                        <CardHeader>
                                        </CardHeader>
                                        <CardBody>
                                        <p style={{ color: 'rgb(53, 162, 235)' }}>
                                        {description_list[graphActiveIndex]}
                                        </p>
                                            
                                        </CardBody>
                                    </Card>   
    
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}

export default KpiDescription;
