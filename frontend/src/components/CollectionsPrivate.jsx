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
                <Col xl={2} lg={4} md={3} sm={12} xs={12} className="d-flex flex-column justify-content-center align-items-center">
                    <Container className="d-flex justify-content-center">
                        <Image
                            src={props.person?.avatar || "./img/noName.svg"}
                            rounded
                            height="180px"
                        />
                    </Container>
                    <Container className="h3 mt-3 text-center">{props.person?.name || "No Name"}</Container>
                </Col>
                <Col xl={8} lg={5} md={6} sm={12} xs={12} className="d-flex flex-column justify-content-end">
                    <CreateCal theme={props.theme} i18n={props.i18n} t={props.t}></CreateCal>
                </Col>
                <Col xl={2} lg={3} md={3} sm={12} xs={12} className="filter__main d-flex flex-column justify-content-start">
                    <Filter i18n={props.i18n} t={props.t}></Filter>
                </Col>

            </Row>
        </Container>
    );
}

export default CollectionsPrivate;
