import React, { useState, useEffect, useRef } from "react";

import { useNavigate, NavLink, useParams } from "react-router-dom";

import { Button } from "react-bootstrap";
import { Container, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import ItemField from "./ItemField";
import Comment from "./Comment";
import { socket } from "./socket";
import TagsAreaSetting from "./TagsAreaSetting";
import TagField from "./TagField";
import ModalAnswer from "./ModalAnswer";

import { v4 as uuidv4 } from "uuid";

function ItemTemplate(props) {
    let [itemData, setItemData] = useState({});
    let [itemFields, setItemFields] = useState([]);
    let [comments, setComments] = useState([]);
    let [mainOwner, setMainOwner] = useState({ owner: true });
    let [tagsValue, setTagsValue] = useState();
    let [likes, setLikes] = useState([0, false]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [textAnswer, setTextAnswer] = useState("");

    let tagsList = useRef([]);
    let likeManager = useRef();

    let { col_id, item_id } = useParams();

    const navigate = useNavigate();

    function createFormData(form) {
        let formData = new FormData(form);
        let checkboxes = form.querySelectorAll(
            ".form-check-input[type=checkbox]"
        );
        for (let i = 0; i < checkboxes.length; ++i) {
            if (checkboxes[i].checked == false) {
                formData.set([checkboxes[i].name], false);
            } else {
                formData.set([checkboxes[i].name], true);
            }
        }
        return formData;
    }

    function closeAnswer(value) {
        setShowAnswer(value);
    }

    function createObject(form) {
        let formObj = {};
        for (const value of form.entries()) {
            formObj[`${value[0]}`] = value[1];
        }
        return formObj;
    }

    function saveChanges(e) {
        e.preventDefault();
        if(e.currentTarget.getElementsByClassName("main-tag-area")[0].value.length < 2){
            return;
        }
        let fields = findFields(e);
        let formData = createFormData(e.currentTarget);
        let object = createObject(formData);
        object.item_id = e.currentTarget.dataset.item_id;
        object.col_id = e.currentTarget.dataset.col_id;
        setTagsValue(object.tags);
        socket.emit("change_item", JSON.stringify(object));
        changeState(true, fields);
        setTextAnswer("saveData");
        setShowAnswer(true);
    }

    function addComment(data) {
        let comments = data.map((el) => {
            return <Comment key={uuidv4()} t={props.t} data={el}></Comment>;
        });
        setComments((prev) => {
            return [...prev, ...comments];
        });
    }

    function createComment(e) {
        e.preventDefault();
        let formData = createFormData(e.currentTarget);
        let data = createObject(formData);
        data.item_id = e.currentTarget.dataset.item_id;
        data.col_id = e.currentTarget.dataset.col_id;
        data.date = getDate();
        socket.emit("get_comment", JSON.stringify(data));
        e.currentTarget.getElementsByTagName("textarea")[0].value = "";
    }

    function getDate() {
        let date = new Date();
        let fullDate = `${fixDate(date.getUTCHours())}:${fixDate(
            date.getUTCMinutes()
        )}; ${fixDate(date.getUTCDate())}.${fixDate(
            date.getUTCMonth() + 1
        )}.${fixDate(date.getUTCFullYear())}`;
        return fullDate;
    }

    function fixDate(date) {
        if (date < 10) {
            return "0" + date;
        } else {
            return date;
        }
    }

    function changeLikeState(e) {
        if (!e.currentTarget.dataset.item_id) {
            return;
        }
        socket.emit(
            "new_like",
            JSON.stringify({ item_id: `${e.currentTarget.dataset.item_id}` })
        );
    }

    async function deleteItem(e) {
        let form = e.currentTarget.closest("form");
        socket.emit(
            "delete_item",
            JSON.stringify({
                item_id: form.dataset.item_id,
                col_id: form.dataset.col_id,
            })
        );
    }

    function changeState(newState, fields) {
        fields.forEach((element) => {
            if (element.name.includes("checkbox")) {
                element.disabled = newState;
            } else {
                element.readOnly = newState;
            }
        });
    }

    function findFields(e) {
        let form = e.currentTarget.closest("form");
        let fields = [
            ...form.getElementsByTagName("input"),
            ...form.getElementsByTagName("textarea"),
        ];
        return fields;
    }

    function changeReadonly(e) {
        let fields = findFields(e);
        changeState(false, fields);
        setTextAnswer("editMode");
        setShowAnswer(true);
    }

    useEffect(() => {
        socket.on("got_item_info", (headerJSON, dataJSON, ownerJSON) => {
            let header = JSON.parse(headerJSON);
            if (header.err) {
                navigate(`/collection/${col_id}`);
                return;
            }
            let data = JSON.parse(dataJSON);
            let owner = JSON.parse(ownerJSON);

            let field = [
                <ItemField
                    header={header}
                    key={uuidv4()}
                    col={data}
                    t={props.t}
                ></ItemField>,
            ];
            setMainOwner(owner);
            setItemData(data);
            setTagsValue(data.tags);

            let availableFields = (
                <div
                    //style={{ maxWidth: "350px", flex: "1 1 auto" }}
                    className="d-flex flex-column item-tp__user-settings px-0"
                    style={{ flex: "2 1 1", width: "initial" }}
                >
                    {field}
                </div>
            );
            if (field.length > 0) {
                setItemFields(availableFields);
            }
            socket.emit("get_like", JSON.stringify({ item_id: data.item_id }));
        });
        socket.on("delete_item", () => {
            setTextAnswer("itemDeleted");
            setShowAnswer(true);
            window.location.reload();
        });
        socket.on(`${item_id}`, (dataJSON) => {
            let data = JSON.parse(dataJSON);
            if(data.auth == "unAuth"){
                setTextAnswer(data.auth);
                setShowAnswer(true);
                return;
            }
            addComment(data);
        });
        socket.on("got_tags_coll", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            tagsList.current = [...data];
        });
        socket.on("new_like", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            if(data.auth == "unLike"){
                setTextAnswer(data.auth);
                setShowAnswer(true);
                return;
            }
            if (!likeManager.current || likeManager.current.dataset.item_id != data.item_id) {
                return;
            }
            setLikes((prev) => {
                let newLikeAdd = [];
                if (prev[1] == false) {
                    newLikeAdd.push(prev[0] + 1);
                    newLikeAdd.push(true);
                } else {
                    newLikeAdd.push(prev[0] - 1);
                    newLikeAdd.push(false);
                }
                return newLikeAdd;
            });
        });
        socket.on("got_like", (dataJSON) => {
            let data = JSON.parse(dataJSON);
            if (!likeManager.current || likeManager.current.dataset.item_id != data.item_id) {
                return;
            }
            setLikes([data.count, data.liked]);
        });
        socket.emit("get_tags_coll");
        socket.emit("get_item_info", JSON.stringify({ col_id, item_id }));
        socket.emit("old_comment", JSON.stringify({ item_id }));
    }, []);

    return (
        <Container className="px-0">
            <ModalAnswer
                t={props.t}
                closeAnswer={closeAnswer}
                showAnswer={showAnswer}
                textAnswer={textAnswer}
            ></ModalAnswer>
            <Container className="h5 mt-4">
                <NavLink
                    className="nav-link active text-decoration-underline"
                    variant="primary"
                    to={`/collection/${col_id}`}
                    style={{ width: "fit-content" }}
                    key={uuidv4()}
                >
                    <em>{props.t("Public.goToColl")}</em>
                </NavLink>
            </Container>
            <Form
                className="d-flex flex-column"
                data-col_id={itemData.col_id}
                data-item_id={itemData.item_id}
                onSubmit={saveChanges}
            >
                <Container className="h3 text-center">
                    {props.t("ItemTemplate.settings")}
                </Container>
                <Container
                    className="item-tp__main d-flex mt-2"
                    style={{ columnGap: "20px" }}
                >
                    <Container
                        style={{ columnGap: "20px", minWidth: "0px" }}
                        className={
                            mainOwner.owner == false
                                ? "item-tp__default ps-0 pe-0 d-flex justify-content-start ps-0 me-0 item-tp__fields me-auto"
                                : "item-tp__default ps-0 pe-0 d-flex justify-content-start ps-0 me-0 item-tp__fields"
                        }
                    >
                        <Container
                            className="d-flex flex-column ms-0 ps-0 pe-0 px-0"
                            style={{ width: "100%", flex: "1 1 auto" }}
                        >
                            <Form.Group className="text-left">
                                <Form.Label className="all-modals__label h6 text-left">
                                    {props.t("ItemTemplate.name")}
                                </Form.Label>
                                <Form.Control
                                    defaultValue={itemData?.name}
                                    type="text"
                                    size="lg"
                                    className="h4"
                                    readOnly
                                    required
                                    name="name"
                                    maxLength="255"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="all-modals__label h6">
                                    {props.t("ItemTemplate.description")}
                                </Form.Label>
                                <Form.Control
                                    defaultValue={itemData?.description}
                                    style={{ resize: "none" }}
                                    as="textarea"
                                    rows={7}
                                    className="filter__scroll"
                                    readOnly
                                    required
                                    name="description"
                                    maxLength="1024"
                                />
                            </Form.Group>
                            <TagsAreaSetting
                                tagsList={tagsList}
                                defValue={itemData.tags}
                                t={props.t}
                            ></TagsAreaSetting>
                            <TagField
                                defValue={tagsValue}
                                t={props.t}
                            ></TagField>
                            <Container className="px-0 mb-3">
                                <Form.Label className="all-modals__label h6">
                                    Id
                                </Form.Label>
                                <div>{itemData.item_id}</div>
                            </Container>
                        </Container>
                        {itemFields}
                    </Container>

                    {mainOwner.owner == true ? (
                        <Container
                            className="d-flex flex-column ms-0 item-tp__buttons px-0"
                            style={{ width: "fit-content" }}
                        >
                            <Container className="h6 ps-0 mb-2">
                                {props.t("ItemTemplate.setting")}
                            </Container>
                            <Button
                                className="mb-2"
                                onClick={changeReadonly}
                                style={{ maxWidth: "fit-content" }}
                            >
                                {props.t("ItemTemplate.edit")}
                            </Button>

                            <Button
                                className="mb-2"
                                style={{ maxWidth: "fit-content" }}
                                type="submit"
                            >
                                {props.t("ItemTemplate.save")}
                            </Button>

                            <Button
                                onClick={deleteItem}
                                style={{ maxWidth: "fit-content" }}
                            >
                                {props.t("ItemTemplate.delete")}
                            </Button>

                            <Container
                                style={{ width: "fit-content" }}
                                className="ms-0 px-0 mt-4 d-flex align-items-center"
                            >
                                <div
                                    className="me-2"
                                    style={{ fontSize: "1.6rem" }}
                                >
                                    <em>{likes[0]}</em>
                                </div>
                                <Image
                                    src={
                                        process.env.PUBLIC_URL + "/img/like.svg"
                                    }
                                    className={
                                        likes[1] != "false" && likes[1] != false
                                            ? "like__checked"
                                            : "like__unchecked"
                                    }
                                    ref={likeManager}
                                    data-item_id={itemData.item_id}
                                    height="30px"
                                    onClick={changeLikeState}
                                    style={{ cursor: "pointer" }}
                                ></Image>
                            </Container>
                        </Container>
                    ) : (
                        <Container
                            className="d-flex flex-column ms-0 item-tp__buttons px-0"
                            style={{ width: "fit-content" }}
                        >
                            <Container
                                style={{ width: "fit-content" }}
                                className="ms-0 px-0 mt-4 d-flex align-items-center"
                            >
                                <div
                                    className="me-2"
                                    style={{ fontSize: "1.6rem" }}
                                >
                                    <em>{likes[0]}</em>
                                </div>
                                <Image
                                    src={
                                        process.env.PUBLIC_URL + "/img/like.svg"
                                    }
                                    className={
                                        likes[1] != "false" && likes[1] != false
                                            ? "like__checked"
                                            : "like__unchecked"
                                    }
                                    ref={likeManager}
                                    data-item_id={itemData.item_id}
                                    height="30px"
                                    onClick={changeLikeState}
                                    style={{ cursor: "pointer" }}
                                ></Image>
                            </Container>
                        </Container>
                    )}
                </Container>
            </Form>
            <Form
                className="item-tp__comments mt-4"
                data-col_id={itemData.col_id}
                data-item_id={itemData.item_id}
                onSubmit={createComment}
            >
                <Container className="d-flex flex-column px-0">
                    <Container className="px-0">
                        <Form.Group className="mb-3 d-flex align-items-center flex-column">
                            <Form.Label className="h5 all-modals__label text-center mb-3">
                                {props.t("ItemTemplate.comments")}
                            </Form.Label>
                            <Form.Control
                                placeholder={props.t(
                                    "ItemTemplate.commentPlholder"
                                )}
                                style={{ resize: "none" }}
                                as="textarea"
                                rows={7}
                                className="filter__scroll item-tp__main-comment"
                                required
                                name="comment"
                                maxLength="1024"
                            />
                            <Button type="submit" className="mt-3">
                                {props.t("ItemTemplate.post")}
                            </Button>
                        </Form.Group>
                    </Container>
                    <Container className="px-0 d-flex flex-column align-items-center">
                        {comments}
                    </Container>
                </Container>
            </Form>
        </Container>
    );
}

export default ItemTemplate;
