import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
import { v4 as uuidv4 } from 'uuid';

import "./css/scroll.css"

function Filter(props) {
    const [validated, setValidated] = useState(false);

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
                return <Dropdown.Item key={uuidv4()} onClick={(e)=>changeCategory(e)} data-category={el}>{props.t(`Filter.${el}`)}</Dropdown.Item>
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

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <Form style={{height:"100%"}} noValidate validated={validated} onSubmit={handleSubmit} className="d-flex flex-column justify-content-between">
            <Row className="mb-3 d-flex ">
                <Container className="h4 ps-2">{props.t("Filter.filter")}</Container>

                <Form.Label>{props.t("Filter.calName")}</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" data-category-now={categoryLabel} id="main-category" >
                        {categoryLabel}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{maxHeight:"200px",overflow:"auto"}} className="filter__scroll">
                        {category}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Group  md="6" className="mt-3">
                    <Form.Label>{props.t("Filter.category")}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={props.t("Filter.calName")}
                    />
                </Form.Group>
                <Form.Group className="my-3">
                    <Form.Check label={props.t("Filter.imgOnly")} />
                </Form.Group>
            </Row>

            <Button type="submit" style={{maxWidth:"fit-content"}}>{props.t("Filter.filter")}</Button>
        </Form>
    );
}

export default Filter;
