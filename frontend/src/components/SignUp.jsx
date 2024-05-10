import React, { useState, useRef } from "react";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ModalAnswer from "./ModalAnswer"

let imgWithoutPerson = "";

export default function SignUp(props) {
    let imgRef = useRef(null);
    let [valueEmail, setValueEmail] = useState("");
    let [valuePassWord, setValuePassWord] = useState("");
    let [valueUserName, setValueUserName] = useState("");
    
    const [showAnswer, setShowAnswer] = useState(false);
    const [textAnswer, setTextAnswer] = useState("");


    function closeAnswer(value){
        setShowAnswer(value)
    }


    async function sendRequest(e) {
        e.preventDefault();
        let formDataReg = new FormData(e.target.closest("form"));
        if (formDataReg.get("img").size > 0) {
            let reader = new FileReader();
            reader.readAsDataURL(formDataReg.get("img"));
            reader.onload = async function () {
                formDataReg.set("img", reader.result);
                let response = await fetch("/sign_up", {
                    method: "post",
                    body: formDataReg,
                });
                let message = await response.json();
                if(typeof(message.auth) == "string"){
                    setTextAnswer(message.auth)
                    setShowAnswer(true)
                }
                
				e.target.closest("form").reset()
				setValueEmail("")
				setValuePassWord("")
				setValueUserName("")
                if (message.auth == true) {
                    props.redirectFun(message.auth);
					
                }
            };
        }
    }

    return (
        <Container>
            <ModalAnswer t={props.t} closeAnswer={closeAnswer} showAnswer={showAnswer} textAnswer={textAnswer}></ModalAnswer>
            <div
                className="h3 d-flex justify-content-center my-2 mb-3"
                style={{ textAlign: "center" }}
            >
                {props.t("signUp.header")}
            </div>
            <Form
                onSubmit={(e) => {
                    sendRequest(e);
                }}
            >
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>{props.t("signUp.name")}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={props.t("signUp.nameAdd")}
                        name="name"
                        value={valueUserName}
                        onChange={(e) => {
                            setValueUserName(e.target.value);
                        }}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>{props.t("signUp.email")}</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Your.email@..."
                        name="email"
                        value={valueEmail}
                        onChange={(e) => {
                            setValueEmail(e.target.value);
                        }}
                        required
                    />
                    <Form.Text className="text-muted">
                        {props.t("signUp.emailAdd")}
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formFile" ref={imgRef} className="mb-3">
                    <Form.Label>{props.t("signUp.avatar")}</Form.Label>
                    <Form.Control
                        type="file"
                        name="img"
                        accept="image/png, image/jpeg"
                    />
                </Form.Group>

                <Form.Group className="mb-3"  controlId="password">
                    <Form.Label>{props.t("signUp.password")}</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder={props.t("signUp.password")}
                        name="password"
                        value={valuePassWord}
                        onChange={(e) => {
                            setValuePassWord(e.target.value);
                        }}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {props.t("signUp.submit")}
                </Button>
            </Form>
        </Container>
    );
}
