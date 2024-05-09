import React from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from "react-bootstrap/Container";

import ReactMarkdown from 'react-markdown'

import { v4 as uuidv4 } from "uuid";

function CollCard(props) {
    return (
        <Card key={uuidv4()} style={{ width: "18rem" }}>
            <Card.Img variant="top" src={props.data.img || "./img/collection.svg"} />
            <Card.Body>
                <Card.Title>{props.data.name}</Card.Title>
                <Card.Subtitle className="mb-2">{props.data.category}</Card.Subtitle>
                    <ReactMarkdown className="card-text">
                        {props.data.description}
                    </ReactMarkdown>
                <Container className="px-0 d-flex justify-content-center">
                    <Button variant="primary" style={{width: "fit-content"}}>{props.t("CollCard.open")}</Button>
                </Container>
            </Card.Body>
        </Card>
    );
}

export default CollCard;
