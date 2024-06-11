import React from "react";
import { Container, Accordion, Image, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Ratio from "react-bootstrap/Ratio";

function AboutUs(props) {
    return (
        <Container>
            <div
                className="h3 d-flex justify-content-center my-2 mb-3"
                style={{ textAlign: "center" }}
            >
                {props.t("About.header")}
            </div>

            <Accordion defaultActiveKey="0" className="my-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        {props.t("About.title")}
                    </Accordion.Header>
                    <Accordion.Body>{props.t("About.subTitle")}</Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Ratio key={"16x9"} aspectRatio={"16x9"} className="mb-4">
                <iframe
                    src="https://www.youtube.com/embed/Rfd_pDQu8ug?si=0hKxCwDkkHA-2etJ"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
               
            </Ratio>

            <Carousel>
                <Carousel.Item>
                    <Image
                        src={process.env.PUBLIC_URL + "/img/4.png"}
                        text="First slide"
                        style={{ maxHeight: "700px" }}
                    />
                    <Carousel.Caption>
                        <h3>{props.t("About.firstSlideTitle")}</h3>
                        <p>{props.t("About.firstSlideTxt")}</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src={process.env.PUBLIC_URL + "/img/5.png"}
                        text="Second slide"
                        style={{ maxHeight: "700px" }}
                    />
                    <Carousel.Caption>
                        <h3>{props.t("About.secondSlideTitle")}</h3>
                        <p>{props.t("About.secondSlideTxt")}</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        src={process.env.PUBLIC_URL + "/img/6.png"}
                        text="Third slide"
                        style={{ maxHeight: "700px" }}
                    />

                    <Carousel.Caption>
                        <h3>{props.t("About.thirdSlideTitle")}</h3>
                        <p>{props.t("About.thirdSlideTxt")}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="d-flex justify-content-center mt-4">
                <Button variant="primary" size="lg" active width="fit-content">
                    <NavLink className="nav-link" to="/sign_up">
                        {props.t("About.tryFree")}
                    </NavLink>
                </Button>
            </Container>
        </Container>
    );
}

export default AboutUs;
