import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";

import { socket } from "./socket";
import ItemByTag from "./ItemByTag";

function TagPage(props) {
    let [tbody, setBody] = useState([]);
    let { tag } = useParams();
    useEffect(() => {
        socket.emit("items_by_tag", tag);
        socket.on("items_by_tag", (dataJson) => {
            let data = JSON.parse(dataJson);
            if (data.length == 0) {
                let body = (
                    <tr>
                        <td colSpan="100%" className="text-center h6">
                            {props.t("Public.noTags")}
                        </td>
                    </tr>
                );
                setBody(body);
                return;
            }
            let body = [
                <ItemByTag
                    theme={props.theme}
                    t={props.t}
                    key={uuidv4()}
                    elem={data}
                    type="body"
                ></ItemByTag>,
            ];

            setBody((prev) => {
                return body;
            });
        });
    }, [tag]);
    return (
        <Container className="px-0">
            <Container className="text-center h3 my-5 mb-4">
                {`#${tag}`}
            </Container>
            <Container className="overflow-auto">
                <Table striped bordered hover>
                    <thead>
                        <ItemByTag t={props.t} type="header"></ItemByTag>
                    </thead>
                    <tbody>{tbody}</tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default TagPage;
