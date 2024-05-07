import React from 'react'
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';

function AutorisationLinks(props) {


	return (
		<>
		    <Nav.Item>
				<NavLink to="/sign_in" className="nav-link"  end>{props.t("header.signIn")}</NavLink>
			</Nav.Item>
			<Nav.Item>
				<NavLink to="/sign_up" className="nav-link" end>{props.t("header.signUp")}</NavLink>
			</Nav.Item>
		</>
	)
}

export default AutorisationLinks