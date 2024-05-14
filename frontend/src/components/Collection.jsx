import React, { useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom";

import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

import { v4 as uuidv4 } from 'uuid';

import { socket } from "./socket";
import TableCell from "./TableCell";
import Filter from "./Filter";
import AddItem from "./AddItem";
import ModalNewItem from "./ModalNewItem"

function Collection(props) {
    const [refUser, setRefUser] = useState("");

    let [theader, setTheader, useRef] = useState([]);
    let [tbody, setBody] = useState([]);
    let [colCurrent, setColCurrent] = useState({});

    const [modalShow, setModalShow] = useState(false);

    let { col_id } = useParams();

    function formDataCreater(form){
        let checkboxes = form.querySelectorAll(".form-check-input[type=checkbox]")
        let validatedForm = new FormData(form);
        for(let i = 0;i < checkboxes.length;++i){
            if(checkboxes[i].checked == false){
                validatedForm.append([checkboxes[i].name], "false")
            }
        }
        console.log(validatedForm.get("checkbox0"))
        return validatedForm;
    }

    async function formObject(validatedForm){
        let data = {}
        for (const value of validatedForm.entries()) {
            if(value[0].includes("checkbox")){
                if(value[1] != "false"){
                    data[`${value[0]}`] = true
                } else {
                    data[`${value[0]}`] = false
                }
                continue;
            }
            data[`${value[0]}`] = value[1];
        }
        return data
    }



    async function newItem(e){
        e.preventDefault()
        let formData = formDataCreater(e.currentTarget);
        let data = await formObject(formData)
        console.log(data)
        data.col_id = col_id;
        socket.emit("get_item", JSON.stringify(data))
    }

    let showModal = () => {
        setModalShow(true)
    }

    let closeModal = () => {
        setModalShow(false)
    }


    useEffect(() => {
        socket.emit("get_col_items", JSON.stringify({ col_id }));

        socket.on("got_col_items", (colJson, dataJson) => {
            let col = JSON.parse(colJson),
                data = JSON.parse(dataJson);
            setRefUser(col[0]);
            setColCurrent(col[0])
            console.log(col[0])
            let head = <TableCell t={props.t} key={uuidv4()} elem={col} type="header"></TableCell>;
            let body = <TableCell theme={props.theme} t={props.t} key={uuidv4()} elem={data} type="body"></TableCell>;
            setTheader((prev) => {
                return [head];
            });
            setBody((prev) => {
                return [body];
            });
        });

        socket.on("got_item",(dataJSON)=>{
            let data = JSON.parse(dataJSON)
            let card = <AddItem key={uuidv4()} data={[data]} t={props.t}></AddItem>
            let noElements = document.getElementById("tb-cell__no-element");
            
            if(noElements){
                noElements.remove()
                setBody([card])
                return;
            } else {
                setBody((prev)=>{
                    return [ ...prev, card]
                })
            }
        })
    },[]);

    return (
        <Container className="my-5">
            <Row className="user__main">
                <Col
                    xl={7}
                    lg={7}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex collection__xs"
                >
                    <Container className="d-flex flex-column justify-content-center align-items-center">
                        <Container className="d-flex justify-content-center">
                            <Image
                                src={
                                    colCurrent?.img ||
                                    process.env.PUBLIC_URL + "/img/noName.svg"
                                }
                                rounded
                                height="180px"
                            />
                        </Container>
                        <Container className="h3 mt-3 text-center">
                            <Form.Control
                                value={colCurrent?.name || "No Name"}
                                type="text"
                                size="lg"
                                className="text-center h4"
                                readOnly
                            />
                        </Container>
                    </Container>
                    <Container className="d-flex flex-column justify-content-center">
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label className="h6">
                                {props.t("CrElem.description")}
                            </Form.Label>
                            <Form.Control
                                value={colCurrent?.description}
                                style={{ resize: "none" }}
                                as="textarea"
                                rows={9}
                                className="filter__scroll"
                                readOnly
                            />
                        </Form.Group>
                    </Container>
                </Col>
                <Col
                    xl={5}
                    lg={5}
                    md={12}
                    sm={12}
                    xs={12}
                    className="filter__main d-flex justify-content-start align-items-center collection__xs"
                >
                    <Container>
                        <Filter i18n={props.i18n} t={props.t}></Filter>
                    </Container>
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
                            >
                                {props.t("Collection.edit")}
                            </Button>

                            <Button style={{ maxWidth: "fit-content" }}>
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
                </Col>
            </Row>
            <Container className="filter__scroll" style={{ overflow: "auto" }}>
                <Table striped bordered hover className='mt-3 '>
                    <thead>{theader}</thead>
                    <tbody>{tbody}</tbody>
                </Table>
            </Container>
            <ModalNewItem key={uuidv4()} theme={props.theme} newItem={newItem} modalClose={closeModal} showModal={showModal} modalShow={modalShow} t={props.t} col={refUser}></ModalNewItem>        </Container>
    );
}

export default Collection;
