import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Table } from "react-bootstrap";
import { Container } from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";

import ItemByTag from "./ItemByTag";
import { socket } from "./socket";

function SearchPage(props) {

    let { search_req } = useParams();
    let [tbody, setBody] = useState([]);


    useEffect(() => {

        socket.on("got_search", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            if (data.length == 0) {
                let body = (
                    <tr>
                        <td colSpan="100%" className="text-center h6">
                            {props.t("Search.notFound")}
                        </td>
                    </tr>
                );
                setBody(body);
                return;
            }
            let body = [
                <ItemByTag
                    search_req={search_req}
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
        socket.emit("get_search", `${search_req}`);

    }, [search_req]);


    return (
        <Container className="px-0 d-flex flex-column align-items-center">
            <Container className="px-0 h3 text-center mt-5 mb-4">
                {props.t("Search.searchResult") + search_req} 
            </Container>
            <Container className="px-0 filter__scroll" style={{overflow:"auto"}}>
                <Table>
                    <thead>
                        <ItemByTag t={props.t} type="header"></ItemByTag>
                    </thead>
                    <tbody>
                        {tbody}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
}

export default SearchPage;
