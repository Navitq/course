import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { Container, Row, Col, Image } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";

import AutorisationLinks from "./AutorisationLinks";
import StoragePageLinks from "./PersonalStoragePage";
import Search from "./Search";

function Header(props) {
    const [radioValue, setRadioValue] = useState(getUserLanguage());

    const radios = [
        { name: "RU", value: "1" },
        { name: "EN", value: "2" },
    ];

    function getUserLanguage() {
        let localLang = localStorage.getItem("language");
        if (localLang) {
            return getAutoLanguage(localLang);
        } else {
            return getAutoLanguage();
        }
    }

    function getAutoLanguage(currentLanguage = props.currentLanguage) {
        if (currentLanguage != "en" && currentLanguage != "EN") {
            return "1";
        } else {
            return "2";
        }
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home"></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className="justify-content-between"

                >
                    <Nav className="me-auto" style={{whiteSpace: "nowrap"}}>
                        <NavLink to="/" className="nav-link">
                            {props.t("header.about")}
                        </NavLink>
                        <NavLink to="/public" className="nav-link">
                            {props.t("header.collections")}
                        </NavLink>
                        {props.headerState ? null : (
                            <AutorisationLinks t={props.t}></AutorisationLinks>
                        )}
                        {!props.adminState ? null : (
                            <Nav.Item>
                                <NavLink to="/admin" className="nav-link">
                                    {props.t("header.admin")}
                                </NavLink>
                            </Nav.Item>
                        )}
                        {props.headerState ? (
                            <StoragePageLinks
                                changeHeader={props.changeHeader}
                                t={props.t}
                            ></StoragePageLinks>
                        ) : null}
                    </Nav>
                    <Container style={{width:"fit-content"}} className="px-0 mx-0 d-flex header__block">
                        <Form className="d-flex text-align-center">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                className="mb-0 ps-0 theme__changer"
                                onChange={props.changeTheme}
                                checked={props.theme ? true : false}
                                data-bs-theme={props.theme ? "light" : "dark"}
                            />
                        </Form>

                        <Search t={props.t}></Search>

                        <ButtonGroup className="ms-3">
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={
                                        idx % 2
                                            ? "outline-primary"
                                            : "outline-primary"
                                    }
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => {
                                        setRadioValue(e.currentTarget.value);
                                        props.changeLanguage();
                                    }}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </Container>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        // <Container>
        //     <header className="my-4">
        //         <Row>
        //             <Col md="5" sm="5" xs="5">
        //                 <Nav
        //                     variant="pills"
        //                     defaultActiveKey="/home"
        //                     className="d-flex justify-content-start align-items-center"
        //                 >
        //                     <Nav.Item>
        //                         <NavLink to="/" className="nav-link">
        //                             {props.t("header.about")}
        //                         </NavLink>
        //                     </Nav.Item>
        //                     <Nav.Item>
        //                         <NavLink to="/public" className="nav-link">
        //                             {props.t("header.collections")}
        //                         </NavLink>
        //                     </Nav.Item>
        // {props.headerState ? null : (
        //     <AutorisationLinks
        //         t={props.t}
        //     ></AutorisationLinks>
        // )}
        // {!props.adminState ? null : (
        //     <Nav.Item>
        //         <NavLink to="/admin" className="nav-link">
        //             {props.t("header.admin")}
        //         </NavLink>
        //     </Nav.Item>
        // )}
        // {props.headerState ? (
        //     <StoragePageLinks
        //         changeHeader={props.changeHeader}
        //         t={props.t}
        //     ></StoragePageLinks>
        // ) : null}
        //                 </Nav>
        //             </Col>

        //             <Col
        //                 md="7"
        //                 sm="7"
        //                 xs="7"
        //                 className="d-flex align-items-center justify-content-end d-none d-sm-flex"
        //             >
        //                 <Form className="d-flex text-align-center">
        //                     <Form.Check
        //                         type="switch"
        //                         id="custom-switch"
        //                         className="mb-0 theme__changer"
        //                         onChange={props.changeTheme}
        //                         checked={props.theme ? true : false}
        //                         data-bs-theme={props.theme ? "light" : "dark"}
        //                     />
        //                 </Form>

        //                 <Search t={props.t}></Search>

        //                 <ButtonGroup className="ms-3">
        //                     {radios.map((radio, idx) => (
        //                         <ToggleButton
        //                             key={idx}
        //                             id={`radio-${idx}`}
        //                             type="radio"
        //                             variant={
        //                                 idx % 2
        //                                     ? "outline-primary"
        //                                     : "outline-primary"
        //                             }
        //                             name="radio"
        //                             value={radio.value}
        //                             checked={radioValue === radio.value}
        //                             onChange={(e) => {
        //                                 setRadioValue(e.currentTarget.value);
        //                                 props.changeLanguage();
        //                             }}
        //                         >
        //                             {radio.name}
        //                         </ToggleButton>
        //                     ))}
        //                 </ButtonGroup>
        //             </Col>
        //         </Row>
        //     </header>
        // </Container>
    );
}

export default Header;
