import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

function CollTable(props) {
    let [elements, setElements] = useState([]);

    function createElem() {
        props.type == "header" ? createHeader() : createBody();
    }

    function createHeader() {
        let header = [""];
        header.push (
            <thead key={uuidv4()}>
                <tr >
                    <th >№</th>
                    <th >Id</th>
                    <th >{props.t("Public.name")}</th>
                    <th >{props.t("Public.category")}</th>
                    <th >{props.t("Public.description")}</th>
                </tr>
            </thead>
        );
        setElements(header);
    }
    function createBody() {
        let body = [];
        body.push (
            <tr key={uuidv4()} className="coll-table">
                <td >
                    <NavLink
                        className="nav-link active"
                        uuid={props.data.uuid}
                        variant="primary"
                        to={`/collection/${props.data.col_id}`}
                        style={{ width: "100%" }}
                    >
                        {props.index + 1}
                    </NavLink>
                </td>
                <td >
                    <NavLink
                        className="nav-link active"
                        uuid={props.data.uuid}
                        variant="primary"
                        to={`/collection/${props.data.col_id}`}
                        style={{ width: "100%" }}
                    >
                        {props.data.col_id}
                    </NavLink>
                </td>
                <td >
                    <NavLink
                        className="nav-link active"
                        uuid={props.data.uuid}
                        variant="primary"
                        to={`/collection/${props.data.col_id}`}
                        style={{ width: "100%" }}
                    >
                        {props.data.name}
                    </NavLink>
                </td>
                <td >
                    <NavLink
                        className="nav-link active"
                        uuid={props.data.uuid}
                        variant="primary"
                        to={`/collection/${props.data.col_id}`}
                        style={{ width: "100%" }}
                    >
                        {props.t(`Filter.${props.data.category}`)}
                    </NavLink>
                </td>
                <td >
                    <NavLink
                        className="nav-link active"
                        uuid={props.data.uuid}
                        variant="primary"
                        to={`/collection/${props.data.col_id}`}
                        style={{ width: "100%" }}
                    >
                        {props.data.description}
                    </NavLink>
                </td>
            </tr>
        );

        setElements(body);
    }

    useEffect(() => {
        createElem();
    }, []);
    return (<React.Fragment>{elements}</React.Fragment>);
}

export default CollTable;
