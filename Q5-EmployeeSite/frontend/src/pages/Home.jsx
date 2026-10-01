import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const employee =
        JSON.parse(
            localStorage.getItem("employee")
        );


    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("employee");

        navigate("/");

    };


    return (

        <div className="container">

            <div className="card">

                <h1>Employee Home Page</h1>

                <h2>
                    Welcome, {employee?.name}
                </h2>


                <div className="menu">

                    <Link to="/profile">
                        Page 1 - Employee Profile
                    </Link>


                    <Link to="/leave">
                        Page 2 - Application for Leave
                    </Link>


                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Home;