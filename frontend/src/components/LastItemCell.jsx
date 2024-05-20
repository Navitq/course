import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

function LastItemCell(props) {
    let [elements, setElements] = useState([]);
    let fieldsTypes = ["date", "text", "number", "checkbox"];

    function createElem() {
        props.type == "header" ? createHeader() : createBody();
    }

    function createHeader() {
        let header = (
            <tr className="tb-cell__index" key={uuidv4()}>
                <th>{props.t("Public.author")}</th>
                <th>{props.t("Public.collName")}</th>
                <th>{props.t("Public.itemName")}</th>
            </tr>
        );
        setElements([header]);
    }

    function createBody() {
        let body = props.elem.map((el) => {
            return (
                <tr
                    className="tb-cell__index"
                    data-col_id={el.col_id}
                    key={uuidv4()}
                >
                    <td>
                        <NavLink
                            to={`/people/${el.user_id}`}
                            style={{ width: "100%" }}
                            variant="primary"
                            className="nav-link active"
                        >
                            {el.username}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            data-item_id={el.item_id}
                            to={`/collection/${el.col_id}`}
                            style={{ width: "100%" }}
                            variant="primary"
                            className="nav-link active"
                        >
                            
                            {el.nameColl}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            data-item_id={el.item_id}
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                            variant="primary"
                            className="nav-link active"
                        >
                            {el.nameItem}
                        </NavLink>
                    </td>
                </tr>
            );
        });
        setElements(body);
    }

    useEffect(() => {
        createElem();
    }, []);
    return <>{elements}</>;
}

export default LastItemCell;
