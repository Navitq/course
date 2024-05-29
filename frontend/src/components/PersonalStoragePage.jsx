import React from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

export default function StoragePageLinks(props) {
    async function logOut() {
        let resp = await fetch(`${process.env.REACT_APP_HOST}/log_out`, {
            method: "delete",
        });
        let mess = await resp.json();
        if (mess.auth === false) {
            props.changeHeader(mess.auth);
        }
        window.location.reload()
    }

    return (
        <>
            <NavLink to="/private" className="nav-link">
                {props.t("header.yourCall")}
            </NavLink>

            <div
                style={{ cursor: "pointer" }}
                className="nav-link"
                onClick={logOut}
            >
                {props.t("header.logOut")}
            </div>
        </>
    );
}
