import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";

import LastItemCell from "./LastItemCell";
import TagsCloud from "./TagsCloud";
import LargestColl from "./LargestColl";

import { socket } from "./socket";

import { v4 as uuidv4 } from "uuid";

function CollectionsPublic(props) {
    let [tbody, setBody] = useState([]);
    let [largestColl, setLargestColl] = useState([]);
    useEffect(() => {
        socket.emit("get_largest_coll");
        socket.emit("get_last_items");
        socket.on("got_last_items", (dataJson) => {
            let data = JSON.parse(dataJson);

            let body = (
                <LastItemCell
                    theme={props.theme}
                    t={props.t}
                    key={uuidv4()}
                    elem={data}
                    type="body"
                ></LastItemCell>
            );

            setBody((prev) => {
                return [body];
            });
        });

        socket.on("got_largest_coll", (dataJson) => {
            let data = JSON.parse(dataJson);

            let body = (
                <LargestColl
                    theme={props.theme}
                    t={props.t}
                    key={uuidv4()}
                    elem={data}
                    type="body"
                ></LargestColl>
            );

            setLargestColl((prev) => {
                return [body];
            });
        });
    }, []);
    return (
        <Container className="px-0 d-flex flex-column">
            <Container className="px-0 mb-3">
                <Container className="text-center h3 my-5 mb-4">
                    {props.t("Public.lastItems")}
                </Container>
                <Container className="overflow-auto">
                    <Table striped bordered hover>
                        <thead>
                            <LastItemCell
                                t={props.t}
                                type="header"
                            ></LastItemCell>
                        </thead>
                        <tbody>{tbody}</tbody>
                    </Table>
                </Container>
            </Container>
            <Container className="px-0 mb-3">
                <Container className="text-center h3 mb-3">
                    {props.t("Public.collLargest")}
                </Container>
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <LargestColl
                                t={props.t}
                                type="header"
                            ></LargestColl>
                        </thead>
                        <tbody>{largestColl}</tbody>
                    </Table>
                </Container>
            </Container>
            <Container className="px-0 mb-3">
                <Container className="text-center h3 mb-3">
                    {props.t("Public.tagsCloud")}
                </Container>
                <Container>
                    <TagsCloud></TagsCloud>
                </Container>
            </Container>
        </Container>
    );
}

export default CollectionsPublic;
