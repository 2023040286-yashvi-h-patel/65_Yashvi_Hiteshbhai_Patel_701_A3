import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";


function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        return <Navigate to="/" />;

    }


    return children;

}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />


                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/leave"
                    element={
                        <ProtectedRoute>
                            <Leave />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="*"
                    element={
                        <Navigate to="/" />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;