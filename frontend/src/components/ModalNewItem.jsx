import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";

import { v4 as uuidv4 } from "uuid";


function ModalNewItem(props) {
    let fieldsTypes = ["date", "text", "number", "checkbox", "textarea"];
    let [modalFields, setModalFields] = useState("")
    function createItemFileds() {
        let fields = [];
        fieldsTypes.map((type) => {
            for (let i = 0; i < 3; ++i) {
                if (typeof props.col[`${type}` + i] != "object") {
                    let newFieldElem = [];
                    if (type == "checkbox") {
                        newFieldElem.push (
                            <Form.Check
                                name={`${type + i}`}
                                type="checkbox"
                                id={type + i}
                                key={uuidv4()}
                            />
                        );
                    } else {
                        newFieldElem.push (
                            <Form.Control
                                name={`${type + i}`}
                                type={type}
                                required
                                key={uuidv4()}
                            />
                        );
                    }
                    fields.push(
                        <Form.Group
                            key={uuidv4()}
                            className="mt-3"
 
                        >
                            <Form.Label className="h6">
                                {props.col[`${type}` + i]}
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
        setModalFields(fields)
    },[]);

    return (
        <>
            <Modal
                className="collection__create"
                data-bs-theme={props.theme ? "light" : "dark"}
                show={props.modalShow}
                onHide={props.modalClose}
                key={uuidv4()}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h3">
                        {props.t("CrElem.addSetting")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            props.newItem(e);
                        }}
                    >
                        <Container className="px-0 h5">
                            {props.t("ModalItem.headerItem")}
                        </Container>
                        <Form.Group className="mb-3">
                            <Form.Label className="h6">
                                {props.t("ModalItem.name")}
                            </Form.Label>
                            <Form.Control
                                name="name"
                                required
                                type="text"
                                placeholder="Some_name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="h6">
                                {props.t("CrElem.description")}
                            </Form.Label>
                            <Form.Control
                                name="description"
                                required
                                as="textarea"
                                placeholder={props.t("CrElem.about")}
                                rows={3}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="h6">
                                {props.t("ModalItem.itemTags")}
                            </Form.Label>
                            <Form.Control
                                name="tags"
                                required
                                type="text"
                                placeholder={props.t("ModalItem.tagsPlaceholder")}
                            />
                        </Form.Group>

                        {modalFields}

                        <Container className="d-flex justify-content-between px-0 mt-3">
                            <Button
                                variant="secondary"
                                onClick={props.modalClose}
                            >
                                {props.t("ModalColl.close")}
                            </Button>
                            <Button type="submit" variant="primary">
                                {props.t("CrElem.create")}
                            </Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalNewItem;
