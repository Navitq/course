import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

function ItemByTag(props) {
    let [elements, setElements] = useState([]);

    function createElem() {
        props.type == "header" ? createHeader() : createBody();
    }

    function createHeader() {
        let header = (
            <tr className="tb-cell__index" key={uuidv4()}>
                <th>{props.t("Public.author")}</th>
                <th>{props.t("Public.collName")}</th>
                <th>{props.t("Public.itemName")}</th>
                <th>{props.t("Public.tags")}</th>
                <th>{props.t("Public.description")}</th>
            </tr>
        );
        setElements([header]);
    }

    function createBody() {
        console.log(props.elem)
        let body = props.elem.map((el) => {
            let tags = el.tags.split("#");
            tags.shift()
            let tagsData = tags.map((element)=>{
                return (
                    <NavLink
                            to={`/tags/${element}`}
                            style={{ width: "fit-content" }}
                            variant="primary"
                            className="nav-link active"
                            key={uuidv4()}
                        >
                            {`#${element}`}
                    </NavLink>
                )
            })
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
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                            variant="primary"
                            className="nav-link active"
                        >
                            {el.nameItem}
                        </NavLink>
                    </td>
                    <td className="d-flex flex-wrap">
                        {tagsData}
                    </td>
                    <td>
                        <NavLink
                            to={`/collection/${el.col_id}/${el.item_id}`}
                            style={{ width: "100%" }}
                            variant="primary"
                            className="nav-link active"
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

export default ItemByTag;
