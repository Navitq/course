import React, { Component } from "react";
import { Container, Image } from "react-bootstrap";

export default class NotFound extends Component {
    render() {
        return (
            <Container>
                <div
                    className="h1 d-flex justify-content-center my-5 mb-3 text-warning"
                    style={{ textAlign: "center" }}
                >
                    {this.props.t("notFound.404")}
                </div>
                <div className="d-flex justify-content-center my-5 mb-0">
                    <Image src={process.env.PUBLIC_URL + '/img/ghost.jpg'} height="250" />
                </div>
            </Container>
        );
    }
}
