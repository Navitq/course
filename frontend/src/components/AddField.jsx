import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from "uuid";

function AddField(props) {
    let [elements, setElements] = useState([]);
    let elemAmount = useRef(0)

    function createElement(e) {
        if(elemAmount.current >= 3){
            return;
        }

        let newField = (
            <Form.Group key={uuidv4()} className="mb-2">
                <Form.Label>{props.t("ModalColl.fieldName")}</Form.Label>
                <Form.Control name={`newCol${props.type + elemAmount.current}`} placeholder={props.t("ModalColl.fieldName")} />
            </Form.Group>
        );

        elemAmount.current++;
        setElements((prev)=>{
            return [...prev, newField]
        })
    }

    return (
        <>
            {elements}
            <Button variant="outline-secondary" size="sm" onClick={createElement}>{props.t("ModalColl.addField")}</Button>
        </>
      
    );
}

export default AddField;
