import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Dashboard from "components/Dashboard";
import {BrowserRouter, Routes, Route} from "react-router-dom";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
