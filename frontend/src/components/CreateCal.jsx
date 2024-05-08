import React from "react";
import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';


function CreateCal(props) {
    let [category, setCategory] = useState("");
    let [categoryLabel, setCategoryLabel] = useState(props.t("Filter.chseCategory"));

    function changeCategory(e){
        setCategoryLabel(props.t(`Filter.${e.currentTarget.dataset.category}`))
    }
    
    function getCategoryData(){
        fetch("./categories")
        .then((res)=>res.json())
        .then((res)=>{
            let currentCat =  res.map((el)=>{
                return <Dropdown.Item onClick={(e)=>changeCategory(e)} data-category={el}>{props.t(`Filter.${el}`)}</Dropdown.Item>
            })
            setCategory(currentCat)
        })
    }


    useEffect(()=>{
        getCategoryData()
    },[])

    props.i18n.on('languageChanged', () => {
        getCategoryData();
        setCategoryLabel(props.t("Filter.chseCategory"))
    });

    return (
        <Container className="d-flex flex-column" >
            <Container className="ps-0 h4">
                {props.t("CrElem.header")}
            </Container>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{props.t("CrElem.name")}</Form.Label>
                    <Form.Control
                        name="name"
                        required
                        type="text"
                        placeholder="Some_name"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{props.t("CrElem.description")}</Form.Label>
                    <Form.Control
                        name="description"
                        required
                        as="textarea"
                        placeholder={props.t("Filter.about")}
                        rows={1}
                    />
                </Form.Group>

                <Form.Label>{props.t("Filter.calName")}</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-primary"
                        data-category-now={categoryLabel}
                        id="main-category"
                    >
                        {categoryLabel}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                        style={{ maxHeight: "200px", overflow: "auto" }}
                        className="filter__scroll"
                    >
                        {category}
                    </Dropdown.Menu>
                </Dropdown>

                {/* <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{props.t("CrElem.image")}</Form.Label>
                    <Form.Control name="img" type="file" />
                </Form.Group> */}
                <Container  className="d-flex justify-content-between px-0 mt-3">
                    <Button variant="primary">{props.t("CrElem.create")}</Button>
                    <Button variant="outline-primary">{props.t("CrElem.addSetting")}</Button>
                </Container>
            </Form>
            
        </Container>
    );
}

export default CreateCal;
