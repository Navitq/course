import React, { useState, useEffect, useRef } from "react";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import { v4 as uuidv4 } from "uuid";

import CollCard from "./CollCard";
import Filter from "./Filter";
import CreateCal from "./CreateCal";
import CollTable from "./CollTable";

import { socket } from "./socket";
import { Table } from "react-bootstrap";

function CollectionsPrivate(props) {
    let [cards, setCards] = useState([]);
    let [person, setPerson] = useState({});
    let [header, setHeader] = useState(<></>);

    let designChecker = useRef("1");

    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState("1");

    const radios = [
        { name: props.t("Collection.cards"), value: "1" },
        { name: props.t("Collection.table"), value: "2" },
    ];

    function addNewCard(card, type) {
        if (type != "private" && type != "all") {
            return;
        }
        if(designChecker.current == '1'){
            setCards((prev) => {
                return [...prev, card[0]];
            });
        } else {
            setCards((prev) => {
                return [...prev, card[1]];
            });
        }
        
    }

    useEffect(() => {
        socket.on("got_user_data", (data) => {
            let dataParsed = JSON.parse(data);
            setPerson(dataParsed);
        });

        socket.on("got_coll", (dataJson) => {
            let data = JSON.parse(dataJson);
            let mewCards = [];
            if (designChecker.current == "1") {
                for (let i = 0; i < data.length; ++i) {
                    mewCards.push(
                        <CollCard
                            key={uuidv4()}
                            t={props.t}
                            data={data[i]}
                        ></CollCard>
                    );
                }
            } else {
                for (let i = 0; i < data.length; ++i) {
                    mewCards.push(
                        <CollTable
                            key={uuidv4()}
                            t={props.t}
                            data={data[i]}
                            type="body"
                            index={i}
                        ></CollTable>
                    );
                }
                let newHeader = (
                    <CollTable
                        key={uuidv4()}
                        t={props.t}
                        elem={data}
                        type="header"
                    ></CollTable>
                );
                setHeader(newHeader);
            }
            setCards(mewCards);
        });

        socket.emit("get_user_data");
        socket.emit("get_coll");
    }, []);

    return (
        <Container className="my-5">
            <Row className="user__main">
                <Col
                    xl={4}
                    lg={4}
                    md={3}
                    sm={12}
                    xs={12}
                    className="d-flex flex-column justify-content-center align-items-center"
                >
                    <Container className="d-flex justify-content-center">
                        <Image
                            src={
                                ( person.img &&  person.img != 'undefined')
                                    ? person.img
                                    : process.env.PUBLIC_URL + "/img/noName.svg"
                            }
                            roundedCircle="true"
                            style={{maxHeight: "250px"}}
                            fluid
                        />
                    </Container>
                    <Container className="h3 mt-3 text-center">
                        {person?.username || "No Name"}
                    </Container>
                </Col>
                <Col
                    xl={6}
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
                        owner={{ owner: true }}
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
                    <Filter
                        uuid={person?.user_id}
                        i18n={props.i18n}
                        t={props.t}
                    ></Filter>
                </Col>
            </Row>
            <Container>
                <Container className="h3 text-center my-4">
                    {props.t("Private.collections")}
                </Container>
                <Container className="mb-4">
                    <ButtonGroup>
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}_coll`}
                                type="radio"
                                variant={
                                    idx % 2
                                        ? "outline-primary"
                                        : "outline-primary"
                                }
                                name="radio_coll"
                                value={radio.value}
                                checked={radioValue === radio.value}
                                onChange={(e) => {
                                    setCards([]);
                                    setHeader([]);
                                    setRadioValue(e.currentTarget.value);
                                    designChecker.current =
                                        e.currentTarget.value;
                                    socket.emit("get_coll");
                                }}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Container>
                <Container
                    className="d-flex flex-wrap justify-content-around"
                    style={{ gap: "15px" }}
                >
                    {cards.length < 1 ? (
                        props.t("Private.noCollections")
                    ) : radioValue == 1 ? (
                        cards
                    ) : (
                        <Container style={{overflow:"auto"}}>
                            <Table striped bordered hover>
                                {header}
                                <tbody>{cards}</tbody>
                                
                            </Table>
                        </Container>
                    )}
                </Container>
            </Container>
        </Container>
    );
}

export default CollectionsPrivate;
