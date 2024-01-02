import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Dashboard from "src/presentation/Dashboard";
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Location from "./presentation/Location";
import {Container} from "react-bootstrap";

const App: React.FC = () => {
    return (
        <Container className="my-4">
            <Router>
                <Routes>
                    <Route path="/">
                        <Route index element={<Dashboard />} />
                        <Route path="location" element={<Location />} />
                    </Route>
                </Routes>
            </Router>
        </Container>
    );
};

export default App;
