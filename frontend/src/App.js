import { BrowserRouter } from "react-router-dom";
import React, { useState, Suspense, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Container from "react-bootstrap/esm/Container";

import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";

import "./components/css/themeModes.css";

function App() {
    let [headerState, setHeaderState] = useState(false);
    let { t, i18n } = useTranslation();

    let [theme, setTheme] = useState(initState());
    let [language, setLanguage] = useState();


    function changeHeader(regState) {
        setHeaderState(regState);
    }

    function initState() {
        let a = localStorage.getItem("theme");
        if (a == "false") return false;
        return true;
    }

    function changeTheme() {
        setTheme(!theme);
    }

    function changeLanguage(newLanguage) {
        console.log(i18n.language)
        //i18n.changeLanguage(newLanguage);
    }

    useEffect(() => {
        localStorage.setItem("theme", theme);
        console.log(theme, 3);
    }, [theme]);

    return (
        <Container
            fluid
            data-bs-theme={theme ? "light" : "dark"}
            className="theme__app theme__main"
            style={{height:"100%"}}
        >
            <Container
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <BrowserRouter>
                    <Header
                        theme={theme}
                        changeTheme={changeTheme}
                        headerState={headerState}
                        changeHeader={changeHeader}
                        changeLanguage={changeLanguage}
                        currentLanguage = {i18n.language}
                        t={t}
                    ></Header>
                    <MainContent
                        t={t}
                        headerState={headerState}
                        changeHeader={changeHeader}
                    ></MainContent>
                    <Footer t={t}></Footer>
                </BrowserRouter>
            </Container>
        </Container>
    );
}

export default function WrappedApp() {
    return (
        <Suspense fallback="...loading">
            <App />
        </Suspense>
    );
}
