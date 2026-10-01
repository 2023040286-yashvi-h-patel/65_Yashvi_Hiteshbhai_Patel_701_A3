import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [empid, setEmpid] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        empid: empid,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                setError(data.message);

                return;
            }


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "employee",
                JSON.stringify(data.employee)
            );


            navigate("/home");


        } catch (error) {

            setError(
                "Cannot connect to server"
            );

        }

    };


    return (

        <div className="container">

            <div className="card">

                <h1>Employee Login</h1>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}


                <form onSubmit={handleLogin}>

                    <label>
                        Employee ID
                    </label>

                    <input
                        type="text"
                        value={empid}
                        onChange={(e) =>
                            setEmpid(e.target.value)
                        }
                        placeholder="EMP001"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />


                    <button type="submit">
                        Login
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;