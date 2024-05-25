import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/Home";

const AppRouter = () => (
    <Router>
    <Routes>
        <Route
            path={`/`}
            element={<HomePage/>}
          />
    </Routes>
    </Router>
)

export default AppRouter;