import { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";

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

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container className="h4 ps-0">{props.t("Filter.filter")}</Container>
            <Row className="mb-3">
                <Form.Label>{props.t("Filter.calName")}</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" data-category-now={categoryLabel} id="main-category" >
                        {categoryLabel}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{maxHeight:"200px",overflow:"auto"}} className="filter__scroll">
                        {category}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Group as={Col} md="6" className="mt-3">
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

            <Button type="submit">{props.t("Filter.filter")}</Button>
        </Form>
    );
}

export default Filter;
