import React, { useEffect, useState, useRef } from "react";

import { useParams, useNavigate, NavLink } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";

import { socket } from "./socket";
import TableCell from "./TableCell";
import FilterItems from "./FilterItems";
import AddItem from "./AddItem";
import ModalNewItem from "./ModalNewItem";
import ModalAnswer from "./ModalAnswer";

function Collection(props) {
    const [refUser, setRefUser] = useState("");

    let [theader, setTheader] = useState([]);
    let [tbody, setBody] = useState([]);
    let [colCurrent, setColCurrent] = useState({});
    let [mainOwner, setMainOwner] = useState({ owner: false });

    const [showAnswer, setShowAnswer] = useState(false);
    const [textAnswer, setTextAnswer] = useState("");

    let tagsList = useRef([])

    const [modalShow, setModalShow] = useState(false);

    const navigate = useNavigate();

    let { col_id } = useParams();

    function formDataCreater(form) {
        let checkboxes = form.querySelectorAll(
            ".form-check-input[type=checkbox]"
        );
        let validatedForm = new FormData(form);
        for (let i = 0; i < checkboxes.length; ++i) {
            if (checkboxes[i].checked == false) {
                validatedForm.set([checkboxes[i].name], false);
            } else {
                validatedForm.set([checkboxes[i].name], true);
            }
        }
        return validatedForm;
    }

    function closeAnswer(value) {
        setShowAnswer(value);
    }

    async function formObject(validatedForm) {
        let data = {};
        for (const value of validatedForm.entries()) {
            if (value[0].includes("checkbox")) {
                if (value[1] != "false") {
                    data[`${value[0]}`] = true;
                } else {
                    data[`${value[0]}`] = false;
                }
                continue;
            }
            data[`${value[0]}`] = value[1];
        }
        return data;
    }

    function changeState(newState, fields) {
        fields.forEach((element) => {
            element.readOnly = newState;
        });
    }

    function findFields(form) {
        let fields = [
            ...form.getElementsByTagName("input"),
            ...form.getElementsByTagName("textarea"),
        ];
        return fields;
    }

    function editData(e) {
        let form = document.getElementById("collection__main-form");
        let fields = findFields(form);
        changeState(false, fields);
        setTextAnswer("editMode");
        setShowAnswer(true);
    }

    async function saveData(e) {
        let form = document.getElementById("collection__main-form");
        let formData = formDataCreater(form);
        let data = await formObject(formData);
        data.col_id = form.dataset.col_id;
        socket.emit("change_col_data", JSON.stringify(data));
        let fields = findFields(form);
        changeState(true, fields);
        setTextAnswer("saveData");
        setShowAnswer(true);
    }

    async function deleteColl(e) {
        let form = document.getElementById("collection__main-form");
        socket.emit(
            "delete_col_data",
            JSON.stringify({ col_id: form.dataset.col_id })
        );
    }

    async function newItem(e) {
        e.preventDefault();
        let formData = formDataCreater(e.currentTarget);
        let data = await formObject(formData);
        data.col_id = col_id;
        socket.emit("get_item", JSON.stringify(data));
    }

    let showModal = () => {
        setModalShow(true);
    };

    let closeModal = () => {
        setModalShow(false);
    };

    useEffect(() => {
        socket.emit("get_col_items", JSON.stringify({ col_id }));
        socket.emit("get_tags_coll");
        socket.on("got_tags_coll", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            tagsList.current = [...data];
        });
        socket.on("filtered_items", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            let body = (
                <TableCell
                    theme={props.theme}
                    t={props.t}
                    key={uuidv4()}
                    elem={data}
                    type="body"
                ></TableCell>
            );
            setBody((prev) => {
                return [body];
            });
        });
        socket.on("got_col_items", (colJson, dataJson, ownerJSON) => {
            let col = JSON.parse(colJson);
            if (col.err) {
                navigate(`/private`);
                return;
            }
            let owner = JSON.parse(ownerJSON);
            let data = JSON.parse(dataJson);
            setRefUser(col[0]);
            setColCurrent(col[0]);
            let head = (
                <TableCell
                    t={props.t}
                    key={uuidv4()}
                    elem={col}
                    type="header"
                ></TableCell>
            );
            let body = (
                <TableCell
                    theme={props.theme}
                    t={props.t}
                    key={uuidv4()}
                    elem={data}
                    type="body"
                ></TableCell>
            );
            setMainOwner(owner);

            setTheader((prev) => {
                return [head];
            });
            setBody((prev) => {
                return [body];
            });
        });

        socket.on("got_item", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            let card = (
                <AddItem key={uuidv4()} data={[data]} t={props.t}></AddItem>
            );
            let noElements = document.getElementById("tb-cell__no-element");

            if (noElements) {
                noElements.remove();
                setBody([card]);
                return;
            } else {
                setBody((prev) => {
                    return [...prev, card];
                });
            }
            setTextAnswer("collNewItem");
            setShowAnswer(true);
        });

        socket.on("delete_col_data", () => {
            setTextAnswer("collDeleted");
            setShowAnswer(true);
            window.location.reload();
        });
    }, []);

    return (
        <Container className="my-4">
            <ModalAnswer
                t={props.t}
                closeAnswer={closeAnswer}
                showAnswer={showAnswer}
                textAnswer={textAnswer}
            ></ModalAnswer>
            <Container className="px-0 h5 mb-3">
                <NavLink
                    className="nav-link active text-decoration-underline"
                    variant="primary"
                    to={`/people/${colCurrent.uuid}`}
                    style={{ width: "fit-content" }}
                    key={uuidv4()}
                >
                    <em>{props.t("Public.goToAuthor")}</em>
                </NavLink>
            </Container>
            <Row className="user__main">
                <Col
                    xl={7}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex collection__xs pe-0"
                >
                    <Form
                        data-col_id={`${colCurrent.col_id}`}
                        id="collection__main-form"
                        className="container collection__xs d-flex px-0"
                    >
                        <Container className="px-0 d-flex flex-column justify-content-center align-items-center">
                            <Container className="d-flex justify-content-center">
                                <Image
                                    src={
                                        colCurrent?.img ||
                                        process.env.PUBLIC_URL +
                                            "/img/noName.svg"
                                    }
                                    rounded
                                    height="180px"
                                />
                            </Container>
                            <Container className="h3 px-0 mt-3 text-center">
                                <Form.Control
                                    name="name"
                                    defaultValue={colCurrent?.name}
                                    type="text"
                                    size="lg"
                                    className="text-center h4"
                                    readOnly
                                    maxLength="255"
                                />
                            </Container>
                        </Container>
                        <Container className="d-flex crt-elem__descr flex-column justify-content-center">
                            <Form.Group className="mb-3">
                                <Form.Label className="h6">
                                    {props.t("CrElem.description")}
                                </Form.Label>
                                <Form.Control
                                    name="description"
                                    defaultValue={colCurrent?.description}
                                    style={{ resize: "none" }}
                                    as="textarea"
                                    rows={9}
                                    className="filter__scroll"
                                    readOnly
                                    maxLength="1024"
                                />
                            </Form.Group>
                        </Container>
                    </Form>
                </Col>
                <Col
                    xl={5}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className=" px-0 filter__main d-flex justify-content-start align-items-center collection__xs"
                >
                    <Container
                        className="mb-3 ms-0"
                        style={{ maxWidth: "340px" }}
                    >
                        <FilterItems
                            theme={props.theme}
                            col={refUser}
                            i18n={props.i18n}
                            t={props.t}
                        ></FilterItems>
                    </Container>

                    {mainOwner.owner == true ? (
                        <Container
                            style={{ height: "-webkit-fill-available" }}
                            className="d-flex flex-column collection__settings"
                        >
                            <Container className="d-flex flex-column  ps-0">
                                <Container className="h4 ps-0 mb-2">
                                    {props.t("Collection.settings")}
                                </Container>
                                <Button
                                    className="mb-2"
                                    style={{ maxWidth: "fit-content" }}
                                    onClick={editData}
                                >
                                    {props.t("Collection.edit")}
                                </Button>

                                <Button
                                    className="mb-2"
                                    style={{ maxWidth: "fit-content" }}
                                    onClick={saveData}
                                >
                                    {props.t("ItemTemplate.save")}
                                </Button>

                                <Button
                                    style={{ maxWidth: "fit-content" }}
                                    onClick={deleteColl}
                                >
                                    {props.t("Collection.delete")}
                                </Button>
                            </Container>
                            <Container className="mt-4 ps-0">
                                <Container className="h4 ps-0 mb-2">
                                    {props.t("Collection.items")}
                                </Container>
                                <Button
                                    className="mb-2"
                                    style={{ maxWidth: "fit-content" }}
                                    onClick={showModal}
                                >
                                    {props.t("Collection.addNewItem")}
                                </Button>
                            </Container>
                        </Container>
                    ) : (
                        ""
                    )}
                </Col>
            </Row>
            <Container className="filter__scroll" style={{ overflow: "auto" }}>
                <Table striped bordered hover className="mt-3 ">
                    <thead>{theader}</thead>
                    <tbody>{tbody}</tbody>
                </Table>
            </Container>
            <ModalNewItem
                key={uuidv4()}
                theme={props.theme}
                newItem={newItem}
                modalClose={closeModal}
                showModal={showModal}
                modalShow={modalShow}
                t={props.t}
                col={refUser}
                tagsList={tagsList.current}
            ></ModalNewItem>
        </Container>
    );
}

export default Collection;
