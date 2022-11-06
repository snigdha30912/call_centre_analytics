import React from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Table,
    Col,
    UncontrolledTooltip
} from "reactstrap";
function RecordingList({ recordings, setActiveIndex, setOpenModal }) {
    return (
        <Col >
            <Card className="card-tasks">
                <CardHeader>
                    <h6 className="title d-inline">Recordings</h6>
                </CardHeader>
                <CardBody>
                    <div className="table-full-width table-responsive">
                        <Table>
                            <tbody>
                                {recordings && recordings.map((recording, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <p className="title">{recording["filename"]}</p>
                                            <p className="text-muted">
                                                {recording.created_at.substring(0,recording.created_at.length-12)}
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip636901683"
                                                title=""
                                                type="button"
                                                onClick={() => setActiveIndex(idx)}
                                            >
                                                <i className="tim-icons icon-chart-bar-32" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={0}
                                                target="tooltip636901683"
                                                placement="right"
                                            >
                                                Analyse Recording
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </Col>
    )
}

export default RecordingList