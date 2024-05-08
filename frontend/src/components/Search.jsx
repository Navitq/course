import React from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Search(props) {
    return (
        <Container className="pe-0 mx-0" style={{width:"fit-content"}}>
            <Form className="d-flex justify-content-end">
                <Form.Group
                className="me-2"
                >
                    <Form.Control name="search" placeholder={props.t("Search.schPlaceholder")} />
                </Form.Group>
                <Button type="submit">{props.t("Search.footer")}</Button>
            </Form>
        </Container>
    );
}

export default Search;
