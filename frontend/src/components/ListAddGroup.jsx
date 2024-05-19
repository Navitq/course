import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import { v4 as uuidv4 } from "uuid";

function ListAddGroup(props) {
    let [data, setData] = useState([]);

    let tags = [
        { tag: "#zaMerzula" },
        { tag: "#zaKarinu" },
        { tag: "#zaMikaIMorti" },
    ];

    function newList(tagsArea) {
        let newData = tags
            .filter((el) => {
                if (el.tag.indexOf(tagsArea) > -1) {
                    return el;
                }
            })
            .map((el) => {
                return (
                    <ListGroup.Item
                        key={uuidv4()}
                        action
                        onClick={(e) => {
                            e.preventDefault();
                            console.log(e.currentTarget.textContent)
                            //props.hint()
                            setData([])
                        }}
                    >
                        {el.tag}
                    </ListGroup.Item>
                );
            });
        setData(newData);
    }

    return <ListGroup style={{ position: "absolute" }}>{data}</ListGroup>;
}

export default ListAddGroup;
