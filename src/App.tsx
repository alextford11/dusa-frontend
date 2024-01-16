import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import {HashRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import Location from "./presentation/Location";
import {Container} from "react-bootstrap";
import StatsList from "./presentation/Stats";
import Backend from "./presentation/Backend";
import Dashboard from "./presentation/Dashboard";
import PasswordEntry from "./components/PasswordEntry";
import Cookies from "universal-cookie";

const InnerApp: React.FC = () => {
    const windowLocation = useLocation();
    const queryParams = new URLSearchParams(windowLocation.search);
    const nsfwIsTrue: boolean = queryParams.get("nsfw") === "true";
    const cookies = new Cookies(null, {path: "/"});

    if (nsfwIsTrue && !cookies.get("nsfwAuthenticated")) {
        return (
            <PasswordEntry
                cookieKey="nsfwAuthenticated"
                authToken={import.meta.env.VITE_NSFW_AUTH_TOKEN}
            />
        );
    } else {
        return (
            <Routes>
                <Route path="/">
                    <Route index element={<Dashboard />} />
                    <Route path="location" element={<Location />} />
                    <Route path="stats" element={<StatsList />} />
                    <Route path="backend" element={<Backend />} />
                </Route>
            </Routes>
        );
    }
};

const App: React.FC = () => {
    return (
        <Container className="my-4">
            <Router>
                <InnerApp />
            </Router>
        </Container>
    );
};

export default App;
