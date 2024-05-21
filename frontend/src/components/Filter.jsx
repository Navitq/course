import { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import { v4 as uuidv4 } from "uuid";

import { socket } from "./socket";
import "./css/scroll.css";

function Filter(props) {
    let [category, setCategory] = useState("");
    let [categoryLabel, setCategoryLabel] = useState(
        props.t("Filter.chseCategory")
    );

    let mainCategory = useRef(props.t("Filter.chseCategory"));

    function changeCategory(e) {
        mainCategory.current = e.currentTarget.dataset.category;
        setCategoryLabel(props.t(`Filter.${e.currentTarget.dataset.category}`));
    }

    function getCategoryData() {
        fetch("/categories")
            .then((res) => res.json())
            .then((res) => {
                let currentCat = res.map((el) => {
                    return (
                        <Dropdown.Item
                            key={uuidv4()}
                            onClick={(e) => changeCategory(e)}
                            data-category={el}
                        >
                            {props.t(`Filter.${el}`)}
                        </Dropdown.Item>
                    );
                });
                setCategory(currentCat);
            });
    }

    useEffect(() => {
        getCategoryData();
    }, []);

    props.i18n.on("languageChanged", () => {
        setCategoryLabel(props.t("Filter.chseCategory"));
    });

    function createFormData(form){
        let formData = new FormData(form);
        if (mainCategory.current != props.t("Filter.chseCategory")) {
            formData.append("category", `${mainCategory.current}`)       
        }
        
        formData.append("uuid", `${props.uuid}`)
        return formData;
    }

    function createObject(formData){
        let data = {}
        for (const value of formData.entries()) {
            if (value[0].includes("checkbox")) {
                if (value[1] != "false") {
                    data[`${value[0]}`] = true;
                } else {
                    data[`${value[0]}`] = false;
                }
                continue;
            }
            data[`${value[0]}`] = value[1];
        }
        return data;
    }

    function getFilteredCol(event) {
        event.preventDefault();
        let data = createObject(createFormData(event.currentTarget))
        socket.emit("filter_coll", JSON.stringify(data))
    }

    return (
        <Form
            style={{ height: "100%" }}
            onSubmit={getFilteredCol}
            className="d-flex flex-column justify-content-between"
        >
            <Row className="mb-3 d-flex ">
                <Container className="h4">{props.t("Filter.filter")}</Container>

                <Form.Label >{props.t("Filter.catName")}</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-primary"
                        data-category-now={mainCategory.current}
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

                <Form.Group className="my-3">
                    <Form.Check name="checkbox_img_only" label={props.t("Filter.imgOnly")} />
                </Form.Group>
            </Row>
            <Container className="px-0 d-flex flex-column">
                <Button type="submit" className="mb-3" style={{ maxWidth: "fit-content"}}>
                    {props.t("Filter.filter")}
                </Button>
                <Button
                    onClick={() => {
                        window.location.reload();
                    }}
                    style={{ maxWidth: "fit-content" }}
                >
                    {props.t("Filter.clean")}
                </Button>
            </Container>
        </Form>
    );
}

export default Filter;
