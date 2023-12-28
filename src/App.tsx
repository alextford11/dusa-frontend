import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Dashboard from "src/presentation/Dashboard";
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Location from "./presentation/Location";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<Dashboard />} />
                    <Route path="location" element={<Location />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
