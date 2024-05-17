import { useRef } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";

import AddField from "./AddField"

function ModalCrColl(props) {
    let dropRef = useRef("")
    return (
        <>
            <Modal
                className="collection__create"
                data-bs-theme={props.theme ? "light" : "dark"}
                show={props.showModal}
                onHide={props.modalClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h3">{props.t("CrElem.addSetting")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e)=>{props.newCollection(e, dropRef.current.dataset.categoryNow); props.modalClose()}}>
                        <Container className="px-0 h5">
                            {props.t("ModalColl.headerCol")}
                        </Container>
                        <Form.Group className="mb-3">
                            <Form.Label className="h6">{props.t("CrElem.name")}</Form.Label>
                            <Form.Control
                                name="name"
                                required
                                type="text"
                                placeholder={props.t("CrElem.name")}
                                value={props.nameField}
                                onChange={props.changeNameField}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label  className="h6">
                                {props.t("CrElem.description")}
                            </Form.Label>
                            <Form.Control
                                name="description"
                                required
                                as="textarea"
                                placeholder={props.t("CrElem.about")}
                                rows={1}
                                value={props.descrField}
                                onChange={props.changeDescField}
                            />
                        </Form.Group>

                        <Form.Label className="h6">{props.t("Filter.category")}</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-primary"
                                data-category-now={props.dataCategory}
                                id="main-category"
                                ref={dropRef}
                            >
                                {props.categoryLabel}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                style={{ maxHeight: "200px", overflow: "auto" }}
                                className="filter__scroll"
                            >
                                {props.category}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Form.Group controlId="formFile" className="mb-3 mt-3">
                            <Form.Label>{props.t("CrElem.image")}</Form.Label>
                            <Form.Control name="img" type="file" />
                        </Form.Group>

                        <Container className="px-0 h5">{props.t("ModalColl.headerItem")}</Container>

                        <Container  className="px-0 mt-2 mb-1 h6">{props.t("ModalColl.addTextField")}</Container>
                        <AddField t={props.t} type="text"></AddField>

                        <Container className="px-0 mt-2 mb-1 h6">{props.t("ModalColl.addNumbField")}</Container>
                        <AddField t={props.t} type="number"></AddField>

                        <Container className="px-0 mt-2 mb-1 h6">{props.t("ModalColl.addCheckField")}</Container>
                        <AddField t={props.t} type="checkbox"></AddField>

                        <Container className="px-0 mt-2 mb-1 h6">{props.t("ModalColl.addTtxAreaField")}</Container>
                        <AddField t={props.t} type="textarea"></AddField>

                        <Container className="px-0 mt-2 mb-1 h6">{props.t("ModalColl.addDateField")}</Container>
                        <AddField t={props.t} type="date"></AddField>

                        <Container className="d-flex justify-content-between px-0 mt-3">
                            <Button
                                variant="secondary"
                                onClick={props.modalClose}
                            >
                                {props.t("ModalColl.close")}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                            >
                                {props.t("CrElem.create")}
                            </Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalCrColl;
