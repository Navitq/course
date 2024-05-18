import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

function TableCell(props) {
    let [elements, setElements] = useState([]);
    let fieldsTypes = ["date", "text", "number", "checkbox"];

    useEffect(() => {
        createElem();
    }, []);

    function createHeader() {
        let headerFields = props.elem.map((el, index) => {
            let fields = [];
            fieldsTypes.map((type) => {
                for (let i = 0; i < 3; i++) {
                    if (typeof el[`${type}` + i] != "object") {
                        fields.push(
                            <th key={uuidv4()}>{el[`${type}` + i]}</th>
                        );
                    }
                }
            });
            return (
                <tr
                    className="tb-cell__index"
                    data-col_id={el.col_id}
                    key={uuidv4()}
                >
                    <th>{props.t("TableCell.id")}</th>
                    <th>{props.t("TableCell.name")}</th>
                    {/* <th>{props.t("TableCell.description")}</th> */}
                    <th>{props.t("TableCell.tags")}</th>
                    {fields}
                </tr>
            );
        });
        setElements(headerFields);
    }

    function createBody() {
        let headerFields = props.elem.map((el, index) => {
            let fields = [];
            fieldsTypes.map((type) => {
                for (let i = 0; i < 3; i++) {
                    if (typeof el[`${type}` + i] != "object") {
                        if (type == "checkbox") {
                            fields.push(
                                <th  key={uuidv4()}>
                                    <NavLink
                                        className="nav-link active"
                                        data-item_id={el.item_id}
                                        variant="primary"
                                        to={`/collection/${el.col_id}/${el.item_id}`}
                                        style={{ width: "100%" }}
                                    >
                                       { <Form.Check 
                                            type="checkbox"
                                            checked={
                                                el[`${type}` + i] == true
                                                    ? true
                                                    : false
                                            }
                                            readOnly
                                            key={uuidv4()}
                                        />}
                                    </NavLink>
                                </th>
                            );
                            continue;
                        }
                        fields.push(
                            <td  key={uuidv4()}>
                                <NavLink
                                    className="nav-link active"
                                    data-item_id={el.item_id}
                                    variant="primary"
                                    to={`/collection/${el.col_id}/${el.item_id}`}
                                    style={{ width: "100%" }}
                                >
                                    {el[`${type}` + i]}
                                </NavLink>
                            </td>
                        );
                    }
                }
            });
            return (
                <tr
                    className="tb-cell__index"
                    data-item_id={el.item_id}
                    data-col_id={el.col_id}
                    key={uuidv4()}
                >
                    <td >
                        <NavLink
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {index + 1}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.name}
                        </NavLink>
                    </td>
                    {/* <th>{props.el.description}</th> */}
                    <td>
                        <NavLink
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.tags}
                        </NavLink>
                    </td>
                    {fields}
                </tr>
            );
        });
        if (headerFields.length < 1) {
            headerFields = (
                <tr  key={uuidv4()}>
                    <td
                        id="tb-cell__no-element"
                        className="text-center"
                        colSpan={"100%"}
                    >
                        {props.t("TableCell.noElemt")}
                    </td>
                </tr>
            );
        }
        setElements(headerFields);
    }

    function createElem() {
        props.type == "header" ? createHeader() : createBody();
    }

    return <>{elements}</>;
}

export default TableCell;
