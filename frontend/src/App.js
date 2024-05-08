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
    let [adminState, setAdminState] = useState(false);

    let { t, i18n } = useTranslation();

    let [theme, setTheme] = useState(initState());

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
        if (i18n.language != "en") {
            i18n.changeLanguage("en");
            localStorage.setItem("language", "en");
        } else {
            i18n.changeLanguage("ru");
            localStorage.setItem("language", "ru");
        }
    }

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <Container
            fluid
            data-bs-theme={theme ? "light" : "dark"}
            className="theme__app theme__main"
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                flex: "1 1 auto",
            }}
        >
            <Container
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100%",
                    flex: "1 1 auto",
                }}
            >
                <BrowserRouter>
                    <Header
                        adminState={adminState}
                        theme={theme}
                        changeTheme={changeTheme}
                        headerState={headerState}
                        changeHeader={changeHeader}
                        changeLanguage={changeLanguage}
                        currentLanguage={i18n.language}
                        t={t}
                    ></Header>
                    <MainContent
                        t={t}
                        adminState={adminState}
                        headerState={headerState}
                        changeHeader={changeHeader}
                        i18n={i18n}
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
