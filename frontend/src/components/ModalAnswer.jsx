import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalAnswer(props) {

    function handleClose(){
        props.closeAnswer(false)
    } 



    return (
        <>
            <Modal show={props.showAnswer} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t("ModalAnswer.warning")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.t("ModalAnswer."+props.textAnswer)}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        {props.t("ModalAnswer.ok")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalAnswer;
