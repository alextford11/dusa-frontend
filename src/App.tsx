import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Location from "./presentation/Location";
import {Container} from "react-bootstrap";
import StatsList from "./presentation/Stats";
import Backend from "./presentation/Backend";
import Dashboard from "./presentation/Dashboard";

const App: React.FC = () => {
    return (
        <Container className="my-4">
            <Router>
                <Routes>
                    <Route path="/">
                        <Route index element={<Dashboard />} />
                        <Route path="location" element={<Location />} />
                        <Route path="stats" element={<StatsList />} />
                        <Route path="backend" element={<Backend />} />
                    </Route>
                </Routes>
            </Router>
        </Container>
    );
};

export default App;
