import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import { v4 as uuidv4 } from 'uuid';

import CollCard from "./CollCard";
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

        socket.on("got_user_data", (data) => {
            let dataParsed = JSON.parse(data);
            setPerson(dataParsed);
        });

        socket.on("got_coll", (dataJson) => {
            let data = JSON.parse(dataJson);
            let mewCards = [];
            for(let i =0; i < data.length;++i){
                mewCards.push(<CollCard key={uuidv4()} t={props.t} data={data[i]}></CollCard>)
            }
            setCards(mewCards)
        });

        socket.emit("get_user_data");
        socket.emit("get_coll");
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
                        {person?.username || "No Name"}
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
                    <Filter uuid={person?.user_id} i18n={props.i18n} t={props.t}></Filter>
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
