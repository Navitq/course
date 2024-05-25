import React, { Component } from "react";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { socket } from "./socket";

export class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { valueEmail: "", valuePassWord: "" };

        this.setValueEmail = this.setValueEmail.bind(this);
        this.setValuePassWord = this.setValuePassWord.bind(this);

        this.sendRequest = this.sendRequest.bind(this);
    }

    async sendRequest(e) {
        e.preventDefault();
        let response = await fetch("/sign_in", {
            method: "post",
            body: new FormData(e.currentTarget)
        })
        if(response.status == 401){
            this.props.redirectFun(false);
            return
        }
        let message = await response.json();

        if(message.auth == true){
            window.location.reload()
        }    
    }

    setValueEmail(event) {
        this.setState({ valueEmail: event.target.value });
    }

    setValuePassWord(event) {
        this.setState({ valuePassWord: event.target.value });
    }

    render() {
        return (
            <Container>
                <Container 
                    className="h3 d-flex justify-content-center my-5 mb-4"
                    style={{ textAlign: "center" }}
                >
                    {this.props.t("signIn.header")}
                </Container>
                <Form
                    onSubmit={(e) => {
                        this.sendRequest(e);
                    }}
                    className="d-flex align-items-center justify-content-center flex-column"
                >
                    <Form.Group className="mb-3" controlId="email" style={{maxWidth:"600px", width:"100%"}}>
                        <Form.Label className="text-center">{this.props.t("signIn.email")}</Form.Label>
                        <Form.Control
                            className="sign-in__email"
                            type="text"
                            placeholder="Your.email@..."
                            name="email"
                            value={this.valueEmail}
                            onChange={(e) => {
                                this.setValueEmail(e);
                            }}
                            maxLength="255"
                            required
                        />
                        <Form.Text className="text-muted">
                            {this.props.t("signIn.emailAdd")}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3"  style={{maxWidth:"600px", width:"100%"}} controlId="password">
                        <Form.Label>{this.props.t("signIn.password")}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={this.props.t("signIn.password")}
                            name="password"
                            value={this.valuePassWord}
                            onChange={(e) => {
                                this.setValuePassWord(e);
                            }}
                            maxLength="255"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{width:"fit-content"}}>
                        {this.props.t("signIn.submit")}
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default SignIn;
