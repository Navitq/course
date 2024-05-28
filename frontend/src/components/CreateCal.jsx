import React, { useState, useEffect, useRef } from "react";

import { v4 as uuidv4 } from "uuid";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import { useParams } from "react-router-dom";

import CollCard from "./CollCard";
import ModalCrColl from "./ModalCrColl";
import CollTable from "./CollTable";

import { socket } from "./socket";

function CreateCal(props) {
    let [category, setCategory] = useState("");
    let [categoryLabel, setCategoryLabel] = useState(
        props.t("Filter.chseCategory")
    );

    let [dataCategory, setDataCategory] = useState("");

    let { user_id } = useParams();

    let dropRef = useRef("");

    const [showModal, setShowModal] = useState(false);

    const [nameField, setNameField] = useState("");
    const [descrField, setDescrField] = useState("");

    const modalClose = () => setShowModal(false);
    const modalShow = () => setShowModal(true);

    props.i18n.on("languageChanged", () => {
        setCategoryLabel(props.t("Filter.chseCategory"));
    });

    useEffect(() => {
        socket.on("got_new_coll", (dataJSON, typeOfColl) => {
            let data = JSON.parse(dataJSON);
            let card = [
                createCollCard(data),
                <CollTable
                    key={uuidv4()}
                    t={props.t}
                    data={data}
                    type="body"
                    index={document.getElementsByClassName("coll-table").length}
                ></CollTable>,
            ];
            props.addNewCard(card, typeOfColl);
        });
        getCategoryData();
    }, []);

    function formDataCreater(form, dropDown) {
        let invalidatedForm = new FormData(form);
        let validatedForm = new FormData();
        validatedForm.append("category", `${dropDown}`);

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

    async function newCollection(e, dropDown) {
        e.preventDefault();
        if (dropDown == props.t("Filter.chseCategory") || dropDown == "") {
            return;
        }

        let formData = formDataCreater(e.currentTarget, dropDown);
        let data = await formObject(formData);

        if (user_id) {
            socket.emit("get_new_coll", JSON.stringify(data), user_id);
        } else {
            socket.emit("get_new_coll", JSON.stringify(data));
        }
        setDescrField("");
        setNameField("");
    }

    function createCollCard(data) {
        return <CollCard key={uuidv4()} t={props.t} data={data}></CollCard>;
    }

    function changeNameField(e) {
        setNameField(e.currentTarget.value);
    }

    function changeDescField(e) {
        setDescrField(e.currentTarget.value);
    }

    function changeCategory(e) {
        setDataCategory(e.currentTarget.dataset.category);
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

    return (
        <Container className="d-flex flex-column ps-0">
            <Container className="ps-0 h4">
                {props.t("CrElem.header")}
            </Container>
            <Form
                onSubmit={(e) => {
                    newCollection(e, dropRef.current.dataset.categoryNow);
                }}
            >
                <Form.Group className="mb-3">
                    <Form.Label>{props.t("CrElem.name")}</Form.Label>
                    <Form.Control
                        name="name"
                        required
                        type="text"
                        placeholder={props.t("CrElem.name")}
                        value={nameField}
                        onChange={changeNameField}
                        readOnly={!props.owner.owner}
                        maxLength="255"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>{props.t("CrElem.description")}</Form.Label>
                    <Form.Control
                        name="description"
                        required
                        as="textarea"
                        className="filter__scroll"
                        placeholder={props.t("CrElem.about")}
                        rows={1}
                        value={descrField}
                        onChange={changeDescField}
                        readOnly={!props.owner.owner}
                        maxLength="1024"
                    />
                </Form.Group>

                <Form.Label>{props.t("Filter.calName")}</Form.Label>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-primary"
                        data-category-now={dataCategory}
                        id="main-category"
                        ref={dropRef}
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

                <Container className="d-flex justify-content-between px-0 mt-3 coll_main">
                    {props.owner.owner == true ? (
                        <Button
                            type="submit"
                            variant="primary"
                            style={{ width: "fit-content" }}
                        >
                            {props.t("CrElem.create")}
                        </Button>
                    ) : (
                        ""
                    )}
                    {props.owner.owner == true ? (
                        <Button
                            variant="outline-primary"
                            style={{ width: "fit-content" }}
                            onClick={modalShow}
                        >
                            {props.t("CrElem.addSetting")}
                        </Button>
                    ) : (
                        ""
                    )}
                </Container>
            </Form>

            <ModalCrColl
                dataCategory={dataCategory}
                newCollection={newCollection}
                category={category}
                categoryLabel={categoryLabel}
                changeCategory={changeCategory}
                changeNameField={changeNameField}
                changeDescField={changeDescField}
                nameField={nameField}
                descrField={descrField}
                theme={props.theme}
                showModal={showModal}
                t={props.t}
                i18n={props.i18n}
                modalClose={modalClose}
            ></ModalCrColl>
        </Container>
    );
}

export default CreateCal;
