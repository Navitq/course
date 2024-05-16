import React from "react";

import Alert from "react-bootstrap/Alert";

function Comment(props) {
    return (
        <Alert variant="primary" className="item-tp__main-comment">
            <Alert.Heading>{props.data.username}</Alert.Heading>
            <p style={{wordWrap:"break-word"}}>{props.data.comment}</p>
            <hr />
            <div className="mb-0 d-flex justify-content-end">
                <span style={{width:"fit-content"}}>{props.t("ItemTemplate.publicationDate")}{props.data.date}</span>
            </div>
        </Alert>
    );
}

export default Comment;
