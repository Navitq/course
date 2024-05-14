import React, { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import Form from "react-bootstrap/Form";

function AddItem(props) {
    let [line, setLine] = useState([]);

    let fieldsTypes = ["date", "text", "number", "checkbox"];

    function createBody() {
        console.log(props.data)
        let headerFields = props.data.map((el, index) => {
            let fields = [];
            fieldsTypes.map((type) => {
                for (let i = 0; i < 3; i++) {
                    if (typeof el[`${type}` + i] != "object") {
                        if (type == "checkbox") {
                            fields.push(
                                <th>
                                    <Form.Check // prettier-ignore
                                        type="checkbox"
                                        checked={
                                            el[`${type}` + i] == "true"
                                                ? true
                                                : false
                                        }
                                        readOnly
                                        key={uuidv4()}
                                    />
                                </th>
                            );
                            continue;
                        }
                        fields.push(
                            <td key={uuidv4()}>{el[`${type}` + i]}</td>
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
                    <td>{document.getElementsByClassName("tb-cell__index").length}</td>
                    <td>{el.name}</td>
                    {/* <th>{props.el.description}</th> */}
                    <td>{el.tags}</td>
                    {fields}
                </tr>
            );
        });

        return headerFields;
    }

    useEffect(() => {
        
        let newFileds = createBody();
        setLine(newFileds);
    },[]);
    return (
    <>
        {line}
    </>
    )
}

export default AddItem;
