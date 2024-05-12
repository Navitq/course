import React, { useRef } from "react";

import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import ReactMarkdown from "react-markdown";

import { v4 as uuidv4 } from "uuid";

function CollCard(props) {
    let collName = useRef(props.data.category);
    return (
        <Card key={uuidv4()} style={{ width: "18rem" }}>
            <Card.Img
                variant="top"
                src={props.data.img ||(process.env.PUBLIC_URL + '/img/collection.svg')}
            />
            <Card.Body className="d-flex flex-column justify-content-between">
                <div className="d-flex flex-column">
                    <Card.Title>{props.data.name}</Card.Title>
                    <Card.Subtitle className="mb-2">
                        {props.t("Filter.spoons")}
                    </Card.Subtitle>
                    <ReactMarkdown className="card-text">
                        {props.data.description}
                    </ReactMarkdown>
                </div>
                <Container className="px-0 d-flex justify-content-center">
                    <Nav variant="pills" activeKey="1">
                        <Nav.Item>
                            <NavLink
                                className="nav-link active"
                                uuid={props.data.uuid}
                                variant="primary"
                                to={`/collection/${props.data.col_id}`}
                                style={{ width: "fit-content" }}
                            >
                                {props.t("CollCard.open")}
                            </NavLink>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default CollCard;
