import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { socket } from "./socket";

function Footer(props) {
    let [show, setShow] = useState(false);
    let [personalData, setPersonalData] = useState({});
    let [collState, setCollState] = useState();
    let selectRef = useRef();

    let location = useLocation();

    useEffect(()=>{
        socket.on("got_user_jira_info", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            console.log(data)
            setCollState(data.col_id)
            setPersonalData(()=>{
                return data
            });
            setShow(true);
        });

        socket.on("created_ticket_jira", (dataJSON)=>{
            let data = JSON.parse(dataJSON);
        })
        
    }, [])

    function createFormData(form){
        let formData = new FormData(form);
        formData.append("priority", selectRef.current.value)
        return formData;
    }

    function createObject(formData){
        let data = {}
        for (const value of formData.entries()) {
            data[`${value[0]}`] = value[1];
        }
        return data;
    }


    let handleClose = () => {
        setShow(false);
    };

    function submitJIRA(e) {
        e.preventDefault();
        let data = createObject(createFormData(e.currentTarget))
        console.log(data)
        socket.emit("create_ticket_jira", JSON.stringify(data))
        handleClose();
    }

    let handleShow = () => {
        let pathSeparate = [];
        if (location.pathname.includes("collection")) {
            pathSeparate = location.pathname.split("/");
        }
        socket.emit(
            "get_user_jira_info",
            JSON.stringify({ col_id: pathSeparate[2] })
        );
    };

    return (
        <Container>
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                    <Link
                        to="https://github.com/Navitq/task_7"
                        className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
                    >
                        <Image
                            src={
                                process.env.PUBLIC_URL + "/img/GitHub_Logo.png"
                            }
                            height="30"
                        />
                    </Link>
                    <span className="mb-3 mb-md-0 text-body-secondary">
                        {props.t("footer.protection")}
                    </span>
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    {props.headerState === true ? (
                        <li className="ms-3">
                            <Button onClick={handleShow}>
                                {props.t("Jira.help")}
                            </Button>
                        </li>
                    ) : (
                        ""
                    )}
                    <li className="ms-3">
                        <Link
                            className="text-body-secondary"
                            to="https://github.com/Navitq/task_7"
                        >
                            <Image
                                src={
                                    process.env.PUBLIC_URL + "/img/facebook.svg"
                                }
                                height="30"
                            />
                        </Link>
                    </li>
                    <li className="ms-3">
                        <Link
                            className="text-body-secondary"
                            to="https://github.com/Navitq/task_7"
                        >
                            <Image
                                src={process.env.PUBLIC_URL + "/img/insta.svg"}
                                height="30"
                            />
                        </Link>
                    </li>
                    <li className="ms-3">
                        <Link
                            className="text-body-secondary"
                            to="https://github.com/Navitq/task_7"
                        >
                            <Image
                                src={
                                    process.env.PUBLIC_URL + "/img/twitter.svg"
                                }
                                height="30"
                            />
                        </Link>
                    </li>
                </ul>
            </footer>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitJIRA}>
                        <Form.Group className="mb-3">
                            <Form.Label>{props.t("Jira.name")}</Form.Label>
                            <p className="font-weight-bold">
                                {personalData.username}
                            </p>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Id</Form.Label>
                            <p className="font-weight-bold">
                                {personalData.user_id}
                            </p>
                        </Form.Group>
                        {collState != undefined ? (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        {props.t("Jira.collection")}
                                    </Form.Label>
                                    <Form.Control
                                        name="collection"
                                        type="text"
                                        value={personalData.name}
                                        readOnly
                                        className="font-weight-bold"
                                    ></Form.Control>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                >
                                    <Form.Label>
                                        {props.t("Jira.collectionId")}
                                    </Form.Label>
                                    <Form.Control
                                        name="col_id"
                                        type="text"
                                        value={personalData.col_id}
                                        readOnly
                                        className="font-weight-bold"
                                    ></Form.Control>
                                </Form.Group>
                            </>
                        ) : (
                            ""
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                {props.t("Jira.pageAddress")}
                            </Form.Label>
                            <Form.Control
                                name="page_url"
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="font-weight-bold"
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>
                                {props.t("Jira.description")}
                            </Form.Label>
                            <Form.Control
                                required
                                name="description"
                                maxLength="1024"
                                as="textarea"
                                rows={3}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>{props.t("Jira.priority")}</Form.Label>
                            <Form.Select ref={selectRef}>
                                <option value="low">
                                    {props.t("Jira.low")}
                                </option>
                                <option value="middle">
                                    {props.t("Jira.middle")}
                                </option>
                                <option value="height">
                                    {props.t("Jira.height")}
                                </option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>{props.t("Jira.state")}</Form.Label>
                            <Form.Control
                                name="state"
                                type="text"
                                value={props.t("Jira.stateOpen")}
                                readOnly
                                className="font-weight-bold"
                            ></Form.Control>
                        </Form.Group>
                        <Container className="d-flex justify-content-between px-0">
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Footer;
