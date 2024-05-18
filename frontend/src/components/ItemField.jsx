import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";

import { v4 as uuidv4 } from "uuid";

function ItemField(props) {
    let fieldsTypes = ["date", "text", "number", "checkbox", "textarea"];
    let [modalFields, setModalFields] = useState("");
    function createItemFileds() {
        let fields = [];
        fieldsTypes.map((type) => {
            for (let i = 0; i < 3; ++i) {
                if (typeof props.col[`${type}` + i] != "object") {
                    let newFieldElem = [];
                    if (type == "checkbox") {
                        console.log(props.col[`${type}` + i])
                        newFieldElem.push(
                            <Form.Check
                                name={`${type + i}`}
                                type="checkbox"
                                id={type + i}
                                key={uuidv4()}
                                defaultChecked={props.col[`${type}` + i]==true ? true : false}
                                disabled
                            />
                        );
                    } else if (type == "textarea") {
                        newFieldElem.push(
                            <Form.Control
                                name={`${type + i}`}
                                as="textarea"
                                id={type + i}
                                required
                                key={uuidv4()}
                                defaultValue={props.col[`${type}` + i]}
                                readOnly
                                className="filter__scroll"
                                rows={5}
                            />
                        );
                    } else {
                        newFieldElem.push(
                            <Form.Control
                                name={`${type + i}`}
                                type={type}
                                required
                                key={uuidv4()}
                                defaultValue={props.col[`${type}` + i]}
                                readOnly
                            />
                        );
                    }
                    fields.push(
                        <Form.Group key={uuidv4()} className="mt-3">
                            <Form.Label className="h6">
                                {props.header[`${type}` + i]}
                            </Form.Label>
                            {newFieldElem}
                        </Form.Group>
                    );
                }
            }
        });
            return fields;
    }

    useEffect(() => {
        let fields = createItemFileds();
        setModalFields(fields);
    }, []);

    return modalFields;
}

export default ItemField;
