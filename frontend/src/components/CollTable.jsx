import React, {useState, useEffect} from "react";

import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

function CollTable(props) {
    let [elements, setElements] = useState([]);

    function createElem() {
        props.type == "header" ? createHeader() : createBody();
    }

    function createHeader() {
        let header = (
            <thead key={uuidv4()}> 
                <tr  key={uuidv4()}>
                    <th  key={uuidv4()}>{props.t("Public.name")}</th>
                    <th  key={uuidv4()}>{props.t("Public.category")}</th>
                    <th  key={uuidv4()}>{props.t("Public.description")}</th>
                </tr>
            </thead>
        );
        setElements([header]);
    }

    function createBody() {
        let body = props.data.map((el) => {
            return (
                
                <tr key={uuidv4()}>
                    <td  key={uuidv4()}>
                        <NavLink
                            className="nav-link active"
                            uuid={el.uuid}
                            variant="primary"
                            to={`/collection/${el.col_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.name}
                        </NavLink>
                    </td>
                    <td  key={uuidv4()}> 
                        <NavLink
                            className="nav-link active"
                            uuid={el.uuid}
                            variant="primary"
                            to={`/collection/${el.col_id}`}
                            style={{ width: "100%" }}
                        >
                            {props.t(`Filter.${el.category}`)}
                        </NavLink>
                    </td>
                    <td  key={uuidv4()}>
                        <NavLink
                            className="nav-link active"
                            uuid={el.uuid}
                            variant="primary"
                            to={`/collection/${el.col_id}`}
                            style={{ width: "100%" }}
                        >
                            {el.description}
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

export default CollTable;
