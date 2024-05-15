import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import ItemField from "./ItemField";
import { socket } from "./socket";

import { v4 as uuidv4 } from "uuid";

function ItemTemplate(props) {
    let [itemData, setItemData] = useState({});
    let [itemFields, setItemFields] = useState([]);
    let { col_id, item_id } = useParams();

    function createFormData(form){
        let formData = new FormData(form)
        let checkboxes = form.querySelectorAll(".form-check-input[type=checkbox]")
        for(let i = 0;i < checkboxes.length;++i){
            if(checkboxes[i].checked == false){
                formData.set([checkboxes[i].name], "false")
            } else {
                formData.set([checkboxes[i].name], "true")
            }
        }
        return formData;
    }

    function createObject(form){
        let formObj = {}
        for (const value of form.entries()){
            formObj[`${value[0]}`] = value[1];
        }
        return formObj;
    }

    function saveChanges(e) {
        e.preventDefault();
        let fields = findFields(e);
        let formData = createFormData(e.currentTarget)
        let object = createObject(formData)
        object.item_id = e.currentTarget.dataset.item_id
        object.col_id = e.currentTarget.dataset.col_id
        socket.emit("change_item", JSON.stringify(object))
        changeState(true, fields);
    }

    function changeState(newState, fields) {
        fields.forEach((element) => {
            if (element.name.includes("checkbox")) {
                element.disabled = newState;
            } else {
                element.readOnly = newState;
                console.log(element.readOnly);
            }
        });
    }

    function findFields(e) {
        let form = e.currentTarget.closest("form");
        let fields = [
            ...form.getElementsByTagName("input"),
            ...form.getElementsByTagName("textarea"),
        ];
        return fields;
    }

    function changeReadonly(e) {
        let fields = findFields(e);
        changeState(false, fields);
    }

    useEffect(() => {
        socket.on("got_item_info", (headerJSON, dataJSON) => {
            let data = JSON.parse(dataJSON),
                header = JSON.parse(headerJSON);
            console.log(data, 666666666666666);
            let field = [
                <ItemField
                    header={header}
                    key={uuidv4()}
                    col={data}
                    t={props.t}
                ></ItemField>,
            ];
            setItemData(data);
            console.log(field);
            if (field.length > 0) {
                setItemFields(
                    <Container
                        style={{ width: "fit-content", flex: "1 1 auto" }}
                        className="d-flex flex-column item-tp__user-settings"
                    >
                        {field}
                    </Container>
                );
            }
        });
        socket.emit("get_item_info", JSON.stringify({ col_id, item_id }));
    }, []);

    return (
        <Form
            className="d-flex mt-4 flex-column"
            data-col_id={itemData.col_id}
            data-item_id={itemData.item_id}
            onSubmit={saveChanges}
        >
            <Container className="mb-2 h3 text-center mt-3">
                {props.t("ItemTemplate.settings")}
            </Container>
            <Container className="item-tp__main d-flex mt-4">
                <Container
                    style={{ width: "fit-content" }}
                    className="item-tp__default ps-0 pe-0 d-flex justify-content-start ps-0 me-0 item-tp__fields"
                >
                    <Container
                        className="d-flex flex-column ms-0 ps-0 pe-0"
                        style={{ width: "100%", maxWidth: "300px" }}
                    >
                        <Form.Group className="text-left">
                            <Form.Label className="h6 text-left">
                                {props.t("ItemTemplate.name")}
                            </Form.Label>
                            <Form.Control
                                defaultValue={itemData?.name}
                                type="text"
                                size="lg"
                                className="text-center h4"
                                readOnly
                                required
                                name="name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="h6">
                                {props.t("ItemTemplate.description")}
                            </Form.Label>
                            <Form.Control
                                defaultValue={itemData?.description}
                                style={{ resize: "none" }}
                                as="textarea"
                                rows={7}
                                className="filter__scroll"
                                readOnly
                                required
                                name="description"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="h6">
                                {props.t("ItemTemplate.tags")}
                            </Form.Label>
                            <Form.Control
                                style={{ resize: "none" }}
                                as="textarea"
                                rows={4}
                                className="filter__scroll"
                                readOnly
                                required
                                placeholder={props.t(
                                    "ItemTemplate.tagsPlaceholder"
                                )}
                                defaultValue={itemData?.tags}
                                name="tags"
                            />
                        </Form.Group>
                    </Container>
                    {itemFields}
                </Container>
                <Container
                    className="d-flex flex-column ms-0 item-tp__buttons"
                    style={{ width: "fit-content" }}
                >
                    <Container className="h6 ps-0 mb-2">
                        {props.t("ItemTemplate.setting")}
                    </Container>
                    <Button
                        className="mb-2"
                        onClick={changeReadonly}
                        style={{ maxWidth: "fit-content" }}
                    >
                        {props.t("ItemTemplate.edit")}
                    </Button>

                    <Button
                        className="mb-2"
                        style={{ maxWidth: "fit-content" }}
                        type="submit"
                    >
                        {props.t("ItemTemplate.save")}
                    </Button>

                    <Button style={{ maxWidth: "fit-content" }}>
                        {props.t("ItemTemplate.delete")}
                    </Button>
                </Container>
            </Container>
        </Form>
    );
}

export default ItemTemplate;
