import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";

import LastItemCell from "./LastItemCell";

import { socket } from "./socket";

import { v4 as uuidv4 } from "uuid";

function CollectionsPublic(props) {
    let [tbody, setBody] = useState([]);
    useEffect(() => {
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
    },[]);
    return (
        <Container className="px-0 d-flex flex-column">
            <Container className="px-0">
                <Container className="text-center h3 my-5 mb-3">
                    {props.t("Public.lastItems")}
                </Container>
                <Container className="overflow-auto">
                    <Table striped bordered hover className="">
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
        </Container>
    );
}

export default CollectionsPublic;
