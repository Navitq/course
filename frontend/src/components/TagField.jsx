import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { Container} from 'react-bootstrap';

import { v4 as uuidv4 } from "uuid";

function TagField(props) {
    let [tags, setTags] = useState(props.defValue);

    function createTagField(newValue=props.defValue) {
        if(!props.defValue){
            return;
        }
        let tagList = newValue.split("#");
        tagList.shift();
        let mainTagsList = tagList.map((el) => {
            return (
                <NavLink
                    className="nav-link active"
                    data-item_id={el.item_id}
                    variant="primary"
                    to={`/tags/${el}`}
                    style={{ width: "fit-content", color: "blue"}}
                    key={uuidv4()}
                >
                    {
                        "#"+el
                    }
                </NavLink>
            );
        });
        setTags(mainTagsList)
    }
    

    useEffect(() => {
        createTagField();
    }, [props.defValue]);
    return <Container className="px-0 d-flex mb-2 flex-wrap text-break">{tags}</Container>;
}

export default TagField;
