import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";

import { v4 as uuidv4 } from "uuid";

import ListGroup from "react-bootstrap/ListGroup";

function TagsArea(props) {
    let tagsArea = useRef();
    let [newData, setNewData] = useState("#");
    let [newHint, setNewHint] = useState([]);


    const specialCharsRegex = /[\s*!@_"{}№;%:?*'()\[\]+/~`$^&=\-,.\\<>|]/g;

    function checkTagGrammar(value) {
        value = "#" + value.slice(1);
        value = value.replaceAll(/ /g, "");

        while (value.includes("##")) {
            value = value.replaceAll(/##/g, "#");
        }

        value = value.replaceAll(specialCharsRegex, "");
        return value;
    }

    function tagChecker(e) {
        let position = null;
        let word = [];
        let value = checkTagGrammar(e.currentTarget.value);
        for (let i = 0; i <= value.length; i++) {
            if (value[i] != newData[i]) {
                if (value[i] == undefined) {
                    position = i - 1;
                    break;
                } else {
                    position = i;

                    break;
                }
            }
        }
        if (position) {
            for (let i = position; i >= 0; i--) {
                if (value[i] == "#" && newData[i+1] != "#") {
                    position = i;
                    break;
                }
            }
            let startPosition = position,
                endPosition = null;

            for (let i = position; i >= 0; i++) {
                if (value[i] != undefined) {
                    if (i != position && value[i] == "#") {
                        endPosition = i;
                        break;
                    }
                    word.push(value[i]);
                    continue;
                }
                break;
            }
            let data = props.tagsList
                .filter((el) => {
                    if(el.tag == null){
                        return;
                    }
                    if (el.tag.indexOf(word.join("")) > -1) {
                        return el;
                    }
                })
                .map((el) => {
                    return (
                        <ListGroup.Item
                            key={uuidv4()}
                            action
                            onClick={(e) => {
                                e.preventDefault();
                                let sliced = null;                                
                                if(endPosition){
                                    sliced = tagsArea.current.value.slice(0, startPosition+1) + e.currentTarget.textContent.slice(1) + tagsArea.current.value.slice(endPosition);
                                } else {
                                    sliced = tagsArea.current.value.slice(0, startPosition+1) + e.currentTarget.textContent.slice(1);
                                }
                                setNewData(sliced);
                                setNewHint([]);
                            }}
                            style={{wordWrap:"break-word"}}
                        >
                            {el.tag}
                        </ListGroup.Item>
                    );
                });

            setNewHint((prev) => {
                return data;
            });
        }
        setNewData((prev) => {
            return value;
        });
    }

    function tagCheckerKey(event) {
        if (specialCharsRegex.test(event.key)) {
            event.preventDefault();
        }
    }

    return (
        <Form.Group className="mb-3" style={{ position: "relative" }}>
            <Form.Label className="h6">
                {props.t("ModalItem.itemTags")}
            </Form.Label>
            <Form.Control
                name="tags"
                required
                as="textarea"
                rows={2}
                placeholder={props.t("ModalItem.tagsPlaceholder")}
                onChange={tagChecker}
                onKeyDown={tagCheckerKey}
                value={newData}
                style={{ wordWrap: "break-word" }}
                className="filter__scroll main-tag-area"
                ref={tagsArea}
                maxLength="255"
                minLength="2"
            />
            <ListGroup style={{ position: "absolute", maxHeight: "200px", overflow:"auto", maxWidth: "350px" }} className="filter__scroll">{newHint}</ListGroup>
        </Form.Group>
    );
}

export default TagsArea;
