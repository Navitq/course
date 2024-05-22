import React, { useState, useEffect, useRef } from "react";
import { Container, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import { v4 as uuidv4 } from "uuid";
import { socket } from "./socket";

export default function Admin(props) {
    let [tableCnt, setTableCnt] = useState(null);
    let [checkboxes, setCheckboxes] = useState(false);
    let checkboxesRef = document.querySelectorAll(".admin__checkbox input");

    function handleCheckboxChange(e) {
        checkboxesRef = document.querySelectorAll(".admin__checkbox input");
        for (let i = 0; i < checkboxesRef.length; ++i) {
            console.log(checkboxesRef[i])
            checkboxesRef[i].checked = !checkboxes;
        }
        setCheckboxes(!checkboxes);
    }

    async function sendData(e) {
        checkboxesRef = document.querySelectorAll(".admin__checkbox input");
        let emails = []
        Array.from(checkboxesRef).filter((value) => {
            if (value.checked) {
                emails.push(value.name);
            }
        });
        let emailsParsed = emails.map((val) => {
            return {email: val};
        });
        if(emailsParsed.length < 1){
            return ;
        }

        let data = JSON.stringify(emailsParsed);
        console.log(data)
        setCheckboxes(false);

        socket.emit(`${e.target.dataset.method}`, data)
    }

    useEffect(() => {
        socket.emit("admin_user_list")
        socket.on("admin_user_listed", (dataJSON)=>{
            let data = JSON.parse(dataJSON);
            let checkboxName = {};
            
            let table = data.map((el)=>{
                let row = <tr key={uuidv4()}>
                    <td className='d-flex justify-content-center' >
                        <Form.Check type="switch" name={el.email} className="admin__checkbox" />
                    </td>
                    <td>{el.user_id}</td>
                    <td >{el.email}</td>
                    <td>{el.username}</td>
                    <td>{el.status}</td>
                </tr>
                checkboxName[`${el.email}`] = false;
                return row;
            })
            setTableCnt(table)
        })
        socket.on("request_success",()=>{
            socket.emit("admin_user_list")
        })
        socket.on("request_unsuccess",()=>{
            window.location.reload();
        })
    }, []);

    return (
        <>
            <Container style={{ overflow: "auto" }}>
                <Container
                    className="h3 d-flex justify-content-center my-2 mb-3 px-0"
                    style={{ textAlign: "center" }}
                >
                    {props.t("Admin.header")}
                </Container>
                <Container className="d-flex justify-content-center mb-3">
                    <ButtonGroup aria-label="Toolbar" className="d-flex flex-wrap admin__butt-group">
                        <Button
                            variant="secondary"
                            onClick={sendData}
                            data-method="block_admin"
                        >
                            {props.t("Admin.block")}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={sendData}
                            data-method="unblock_admin"
                        >
                            {props.t("Admin.unblock")}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={sendData}
                            data-method="admin_admin"
                        >
                            {props.t("Admin.admin")}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={sendData}
                            data-method="unblock_admin"
                        >
                            {props.t("Admin.basic")}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={sendData}
                            data-method="delete_admin"
                        >
                            {props.t("Admin.delete")}
                        </Button>
                    </ButtonGroup>
                </Container>
                <Container className="overflow-auto filter__scroll">
                    <Table
                        striped
                        bordered
                        hover
                        style={{ textAlign: "center" }}
                    >
                        <thead>
                            <tr>
                                <th className="d-flex justify-content-center">
                                    <Form.Check
                                        type="switch"
                                        name="main-switcher"
                                        id="main-switcher"
                                        checked={checkboxes}
                                        onChange={handleCheckboxChange}
                                    />
                                </th>
                                <th>{props.t("Admin.id")}</th>
                                <th>{props.t("Admin.email")}</th>
                                <th>{props.t("Admin.name")}</th>
                                <th>{props.t("Admin.status")}</th>
                            </tr>
                        </thead>
                        <tbody>{tableCnt}</tbody>
                    </Table>
                </Container>
            </Container>
        </>
    );
}
