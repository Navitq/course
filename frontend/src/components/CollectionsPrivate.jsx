import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import Filter from "./Filter";

import CreateCal from "./CreateCal";

import { socket } from "./socket";

function CollectionsPrivate(props) {
    let [cards, setCards] = useState([]);
    let [person, setPerson] = useState({});

    function addNewCard(card) {
        setCards((prev) => {
            return [...prev, card];
        });
    }

    useEffect(() => {

        props.socket.once("connect", (data) => {
            console.log("!!!!!!!!!!!!!!!!!!")
        })


        props.socket.on("got_user_data", (data) => {
            console.log(data);
            setPerson(JSON.parse(data));
        });
    }, []);

    return (
        <Container className="my-5">
            <Row className="user__main">
                <Col
                    xl={2}
                    lg={4}
                    md={3}
                    sm={12}
                    xs={12}
                    className="d-flex flex-column justify-content-center align-items-center"
                >
                    <Container className="d-flex justify-content-center">
                        <Image
                            src={person?.img || "./img/noName.svg"}
                            rounded
                            height="180px"
                        />
                    </Container>
                    <Container className="h3 mt-3 text-center">
                        {person?.name || "No Name"}
                    </Container>
                </Col>
                <Col
                    xl={8}
                    lg={5}
                    md={6}
                    sm={12}
                    xs={12}
                    className="d-flex flex-column justify-content-end"
                >
                    <CreateCal
                        addNewCard={addNewCard}
                        theme={props.theme}
                        i18n={props.i18n}
                        t={props.t}
                    ></CreateCal>
                </Col>
                <Col
                    xl={2}
                    lg={3}
                    md={3}
                    sm={12}
                    xs={12}
                    className="filter__main d-flex flex-column justify-content-start"
                >
                    <Filter i18n={props.i18n} t={props.t}></Filter>
                </Col>
            </Row>
            <Container>
                <Container className="h3 text-center my-4">
                    {props.t("Private.collections")}
                </Container>
                <Container
                    className="d-flex flex-wrap justify-content-around"
                    style={{ gap: "15px" }}
                >
                    {cards.length > 0
                        ? cards
                        : props.t("Private.noCollections")}
                </Container>
            </Container>
        </Container>
    );
}

export default CollectionsPrivate;
