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
    let fieldsTypes = ["date", "text", "number", "checkbox", "textarea"];

    let mainCategory = useRef(props.t("Filter.chseCategory"));

    function changeCategory(e) {
        mainCategory.current = e.currentTarget.dataset.category;
        setCategoryLabel(e.currentTarget.dataset.currentValue);
    }

    function arrayFromObject(data) {
        let array = [
            { value: props.t("TableCell.name"), type: "name" },
            { value: props.t("TableCell.description"), type: "description" },
            { value: props.t("TableCell.tags"), type: "tags" },
        ];
        fieldsTypes.map((el) => {
            for (let i = 0; i < 3; ++i) {
                if (data[`${el + i}`] != null) {
                    array.push({
                        value: data[`${el + i}`],
                        type: `${el + i}`,
                    });
                }
            }
        });
        console.log(array);
        return array;
    }

    function getCategoryData(data) {
        let currentCat = data.map((el) => {
            return (
                <Dropdown.Item
                    key={uuidv4()}
                    onClick={(e) => changeCategory(e)}
                    data-category={el.type}
                    data-current-value={el.value}
                >
                    {el.value}
                </Dropdown.Item>
            );
        });
        return currentCat;
    }

    useEffect(() => {
        let data = arrayFromObject(props.col);
        let colValid = getCategoryData(data);
        setCategory(colValid);
    }, [props.col]);

    props.i18n.on("languageChanged", () => {
        setCategoryLabel(props.t("Filter.chseCategory"));
    });

    function createFormData(form) {
        let formData = new FormData(form);
        formData.append(`${mainCategory.current}`, formData.get("filter_items"));
        formData.delete("filter_items")
        formData.append("col_id", `${props.col.col_id}`);
        return formData;
    }

    function createObject(formData) {
        let data = {};
        for (const value of formData.entries()) {
            data[`${value[0]}`] = value[1];
        }
        console.log(data)
        return data;
    }

    function getFilteredCol(event) {
        event.preventDefault();
        if (mainCategory.current == props.t("Filter.chseCategory")) {
            return
        }
        let data = createObject(createFormData(event.currentTarget));
        socket.emit("filter_items", JSON.stringify(data));
    }

    return (
        <>
            <Form
                style={{ height: "100%" }}
                onSubmit={getFilteredCol}
                className="d-flex flex-column justify-content-between"
            >
                <Row className="mb-3 d-flex ">
                    <Container className="h4">
                        {props.t("Filter.filter")}
                    </Container>

                    <Form.Label>{props.t("Filter.catName")}</Form.Label>
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

                    <Form.Group className="my-3 mb-0">
                        <Form.Label className="h6">
                            {props.t("FilterItems.searchValue")}
                        </Form.Label>
                        <Form.Control
                            name="filter_items"
                            placeholder={props.t("FilterItems.searchField")}
                            type="text"
                        />
                    </Form.Group>
                </Row>
                <Container className="px-0 d-flex flex-column">
                    <Container className="px-0 d-flex justify-content-between mb-2">
                        <Button
                            type="submit"
                            className="mb-1"
                            style={{ maxWidth: "fit-content" }}
                            size="sm"
                        >
                            {props.t("Filter.filter")}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            type="submit"
                            className="mb-1"
                            style={{ maxWidth: "fit-content" }}
                            size="sm"
                        >
                            {props.t("FilterItems.addSettings")}
                        </Button>
                    </Container>
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
            <ModalNewItem
                key={uuidv4()}
                theme={props.theme}
                newItem={newItem}
                modalClose={closeModal}
                showModal={showModal}
                modalShow={modalShow}
                t={props.t}
                col={refUser}
            ></ModalNewItem>
        </>
    );
}

export default Filter;
