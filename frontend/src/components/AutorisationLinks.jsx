import React from "react";
import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

function AutorisationLinks(props) {
    return (
        <>
            <NavLink to="/sign_in" className="nav-link" end>
                {props.t("header.signIn")}
            </NavLink>

            <NavLink to="/sign_up" className="nav-link" end>
                {props.t("header.signUp")}
            </NavLink>
        </>
    );
}

export default AutorisationLinks;
