import React, { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import Form from "react-bootstrap/Form";

import { NavLink } from "react-router-dom";

function AddItem(props) {
    let [line, setLine] = useState([]);

    let fieldsTypes = ["date", "text", "number", "checkbox"];

    function createBody() {
        let headerFields = props.data.map((el, index) => {
            let fields = [];
            fieldsTypes.map((type) => {
                for (let i = 0; i < 3; i++) {
                    if (typeof el[`${type}` + i] != "object") {
                        if (type == "checkbox") {
                            fields.push(
                                <th key={uuidv4()}> 
                                    <NavLink
                                        className="nav-link active"
                                        data-item_id={el.item_id}
                                        variant="primary"
                                        to={`/collection/${el.col_id}/${el.item_id}`}
                                        style={{ width: "100%" }}
                                        key={uuidv4()}
                                    >
                                        {<Form.Check // prettier-ignore
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
                            <td key={uuidv4()}>
                                <NavLink
                                    key={uuidv4()}
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
                    <td>
                        <NavLink
                            key={uuidv4()}
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {
                                document.getElementsByClassName(
                                    "tb-cell__index"
                                ).length
                            }
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            key={uuidv4()}
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.item_id}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            key={uuidv4()}
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
                            key={uuidv4()}
                            className="nav-link active"
                            data-item_id={el.item_id}
                            variant="primary"
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.tags}{" "}
                        </NavLink>
                    </td>
                    {fields}
                </tr>
            );
        });

        return headerFields;
    }

    useEffect(() => {
        let newFileds = createBody();
        setLine(newFileds);
    }, []);
    return <>{line}</>;
}

export default AddItem;
