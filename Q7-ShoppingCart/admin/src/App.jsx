import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";


function App() {

    return (

        <BrowserRouter>

            <div className="navbar">

                <h2>
                    Admin Shopping Cart
                </h2>

                <div>

                    <Link to="/">
                        Dashboard
                    </Link>

                    <Link to="/categories">
                        Categories
                    </Link>

                    <Link to="/products">
                        Products
                    </Link>

                </div>

            </div>


            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;