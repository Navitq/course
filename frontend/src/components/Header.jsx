import React from "react";
import { Link, NavLink } from "react-router-dom";

import { Container, Row, Col, Image } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import AutorisationLinks from "./AutorisationLinks";
import StoragePageLinks from "./PersonalStoragePage";

function Header(props) {
    return (
        <Container>
            <header className="my-4">
                <Row>
                    <Col
                        md="2"
                        sm="2"
                        xs="2"
                        className="d-flex align-items-center d-none d-sm-flex"
                    >
                        <Link
                            className="navbar-brand"
                            to="https://github.com/Navitq/task_4"
                        >
                            <Image
                                src="./img/GitHub_Logo.png"
                                height="28"
                                className="me-3"
                            />
                            GitHub
                        </Link>
                    </Col>
                    <Col md="10" sm="10" xs="12" className="site-hd__menu">
                        <Nav
                            variant="pills"
                            defaultActiveKey="/home"
                            className="d-flex justify-content-end align-items-center"
                        >
                            <Nav.Item>
                                <NavLink to="/" className="nav-link">
                                    {props.t("header.about")}
                                </NavLink>
                            </Nav.Item>
                            {props.headerState ? null : (
                                <AutorisationLinks
                                    t={props.t}
                                ></AutorisationLinks>
                            )}
                            {props.headerState ? (
                                <StoragePageLinks
                                    changeHeader={props.changeHeader}
                                    t={props.t}
                                ></StoragePageLinks>
                            ) : null}
                            <Form className="d-flex text-align-center">
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    className="mb-0 theme__changer"
                                    onChange={props.changeTheme}
                                    checked={props.theme ? true : false}
                                    data-bs-theme={
                                        props.theme ? "light" : "dark"
                                    }
                                />
                            </Form>
                            <Button
                                variant="primary"
                                onClick={props.changeLanguage}
                            >
                                {props.currentLanguage}
                            </Button>

                            <ButtonGroup>
                                {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant={
                                            idx % 2
                                                ? "outline-success"
                                                : "outline-danger"
                                        }
                                        name="radio"
                                        value={radio.value}
                                        checked={radioValue === radio.value}
                                        onChange={(e) =>
                                            setRadioValue(e.currentTarget.value)
                                        }
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                            
                        </Nav>
                    </Col>
                </Row>
            </header>
        </Container>
    );
}

export default Header;
