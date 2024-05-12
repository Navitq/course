import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

import { socket } from "./socket";
import TableCell from "./TableCell";
import Filter from "./Filter";
import CreateItem from "./CreateItem";

function Collection(props) {
    let [theader, setTheader] = useState([]);
    let [tbody, setBody] = useState([]);
    let [col, setCol] = useState({});

    let { col_id } = useParams();

    useEffect(() => {
        socket.emit("get_col_items", JSON.stringify({ get_col: col_id }));
        socket.on("got_col_items", (colJson, dataJson) => {
            let col = JSON.parse(colJson),
                data = JSON.parse(dataJson);
            let head = <TableCell elem={col} type="header"></TableCell>;
            let body = <TableCell elem={data} type="body"></TableCell>;
            setTheader((prev) => {
                return [head];
            });
            setBody((prev) => {
                return [body];
            });
        });
    });

    return (
        <Container className="my-5">
            <Row className="user__main">
                <Col
                    xl={6}
                    lg={6}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex collection__xs"
                >
                    <Container className="d-flex flex-column justify-content-center align-items-center">
                        <Container className="d-flex justify-content-center">
                            <Image
                                src={
                                    col?.img ||
                                    process.env.PUBLIC_URL + "/img/noName.svg"
                                }
                                rounded
                                height="180px"
                            />
                        </Container>
                        <Container className="h3 mt-3 text-center">
                            <Form.Control
                                value={col?.username || "No Name"}
                                type="text"
                                size="lg"
                                className="text-center h4"
                                readOnly
                            />
                        </Container>
                    </Container>
                    <Container className="d-flex flex-column justify-content-center">
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label className="h6">
                                {props.t("CrElem.description")}
                            </Form.Label>
                            <Form.Control
                                value={col?.description}
                                style={{ resize: "none" }}
                                as="textarea"
                                rows={9}
                                className="filter__scroll"
                                readOnly
                            />
                        </Form.Group>
                    </Container>
                </Col>
                <Col
                    xl={6}
                    lg={6}
                    md={12}
                    sm={12}
                    xs={12}
                    className="filter__main d-flex justify-content-start align-items-center collection__xs"
                >
                    <Container>
                        <Filter i18n={props.i18n} t={props.t}></Filter>
                    </Container>
                    <Container
                        style={{ height: "-webkit-fill-available" }}
                        className="d-flex flex-column collection__settings"
                    >
                        <Container className="d-flex flex-column  ps-0">
                            <Container className="h4 ps-0 mb-2">
                                {props.t("Collection.settings")}
                            </Container>
                            <Button
                                className="mb-2"
                                style={{ maxWidth: "fit-content" }}
                            >
                                {props.t("Collection.edit")}
                            </Button>

                            <Button style={{ maxWidth: "fit-content" }}>
                                {props.t("Collection.delete")}
                            </Button>
                            
                        </Container>
                        <Container className="mt-4 ps-0">
                                <Container className="h4 ps-0 mb-2">
                                    {props.t("Collection.items")}
                                </Container>
                                <Button
                                    className="mb-2"
                                    style={{ maxWidth: "fit-content" }}
                                >
                                    {props.t("Collection.addNewItem")}
                                </Button>
                            </Container>
                    </Container>
                </Col>
            </Row>
            <Container style={{ overflow: "auto" }}>
                <Table striped bordered hover>
                    <thead>{theader}</thead>
                    <tbody>{tbody}</tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default Collection;
