import React, { useState, useRef } from "react";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ModalAnswer from "./ModalAnswer";

let imgWithoutPerson = "";

export default function SignUp(props) {
    let imgRef = useRef(null);
    let [valueEmail, setValueEmail] = useState("");
    let [valuePassWord, setValuePassWord] = useState("");
    let [valueUserName, setValueUserName] = useState("");

    const [showAnswer, setShowAnswer] = useState(false);
    const [textAnswer, setTextAnswer] = useState("");

    function closeAnswer(value) {
        setShowAnswer(value);
    }



    function resetForm(e) {
        e.target.closest("form").reset();
        setValueEmail("");
        setValuePassWord("");
        setValueUserName("");

    }

    async function sendRequest(e) {
        e.preventDefault();
        let formData = formDataCreater(e.currentTarget);
        let data = await formObject(formData);
        formData.append("img_name", data.img_name);
        formData.set("img", data.img);
        let resJson = await fetch("/sign_up", {
            method: "post",
            body: formData,
        });
        let message = await resJson.json();
        if (typeof message.auth == "string") {
            setTextAnswer(message.auth);
            setShowAnswer(true);
        } else if (message.auth == true) {
            props.redirectFun(message.auth);
        }
        resetForm(e);
    }

    function formDataCreater(form) {
        let invalidatedForm = new FormData(form);
        let validatedForm = new FormData();

        for (const value of invalidatedForm.entries()) {
            if (value[1] != "" && typeof value[1] != typeof {}) {
                validatedForm.append(value[0], value[1]);
            } else if (typeof value[1] == typeof {} && value[1].name != "") {
                validatedForm.append(value[0], value[1]);
            }
        }

        return validatedForm;
    }

    async function formObject(validatedForm) {
        let data = {};
        for (const value of validatedForm.entries()) {
            data[`${value[0]}`] = value[1];
        }
        if (data.img) {
            data.img_name = data.img.name;
            let url = await createAndUploadImg(data.img);
            data.img = url;
        }
        return data;
    }

    async function createImgUrl() {
        let data = await fetch("/s3drop");
        let jsonUrl = await data.json();
        return jsonUrl.url;
    }

    async function uploadImg(img, url) {
        let formImg = new FormData();
        console.log(img);
        formImg.append("img", img, img.name);
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: img,
        });
    }

    async function createAndUploadImg(img) {
        let url = await createImgUrl();
        await uploadImg(img, url);
        let imgUrl = url.split("?")[0];
        return imgUrl;
    }

    return (
        <Container>
            <ModalAnswer
                t={props.t}
                closeAnswer={closeAnswer}
                showAnswer={showAnswer}
                textAnswer={textAnswer}
            ></ModalAnswer>
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

                <Form.Group className="mb-3" controlId="password">
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
