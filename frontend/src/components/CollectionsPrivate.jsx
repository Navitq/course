import React from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import Filter from "./Filter"

import CreateCal from "./CreateCal"


function CollectionsPrivate(props) {
    return (
        <Container className="my-5">
            <Row>
                <Col xs={4} md={4} className="d-flex flex-column justify-content-center align-items-center">
                    <Container className="d-flex justify-content-center">
                        <Image
                            src={props.person?.avatar || "./img/noName.svg"}
                            rounded
                            height="180px"
                        />
                    </Container>
                    <Container className="h3 mt-3 text-center">{props.person?.name || "No Name"}</Container>
                </Col>
                <Col xs={4} md={4}>
                    <Filter i18n={props.i18n} t={props.t}></Filter>
                </Col>
                <Col xs={4} md={4} className="d-flex flex-column justify-content-start">
                    <CreateCal  t={props.t}></CreateCal>
                </Col>
            </Row>
        </Container>
    );
}

export default CollectionsPrivate;
