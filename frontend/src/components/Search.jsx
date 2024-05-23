import React, { useRef } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useNavigate, useParams } from "react-router-dom";

import { socket } from "./socket";

function Search(props) {
    const navigate = useNavigate();
    let { search_req } = useParams();

    let mainSearch = useRef()

    function search(e){
        e.preventDefault()
        navigate(`/search/${mainSearch.current.value}`)
    }   

    return (
        <Container className="pe-0 mx-0 header__search" style={{width:"fit-content"}}>
            <Form className="d-flex justify-content-end" onSubmit={search}>
                <Form.Group
                className="me-2"
                >
                    <Form.Control name="search" ref={mainSearch} id="main_search" placeholder={props.t("Search.schPlaceholder")} />
                </Form.Group>
                <Button type="submit">{props.t("Search.footer")}</Button>
            </Form>
        </Container>
    );
}

export default Search;
