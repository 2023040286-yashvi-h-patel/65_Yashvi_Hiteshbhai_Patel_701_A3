import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {

    const [employee, setEmployee] =
        useState(null);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const token =
            localStorage.getItem("token");


        fetch(
            "http://localhost:5000/api/profile",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )
            .then(async (response) => {

                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message
                    );

                }


                setEmployee(data);

            })
            .catch((error) => {

                setError(error.message);

            });

    }, []);


    return (

        <div className="container">

            <div className="card">

                <h1>Employee Profile</h1>


                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}


                {employee && (

                    <table>

                        <tbody>

                            <tr>
                                <td>
                                    Employee ID
                                </td>

                                <td>
                                    {employee.empid}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Name
                                </td>

                                <td>
                                    {employee.name}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Email
                                </td>

                                <td>
                                    {employee.email}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Department
                                </td>

                                <td>
                                    {employee.department}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Basic Salary
                                </td>

                                <td>
                                    {employee.basicSalary}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    HRA
                                </td>

                                <td>
                                    {employee.hra}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    DA
                                </td>

                                <td>
                                    {employee.da}
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Total Salary
                                </td>

                                <td>
                                    {employee.totalSalary}
                                </td>
                            </tr>

                        </tbody>

                    </table>

                )}


                <br />

                <Link to="/home">
                    Back to Home
                </Link>

            </div>

        </div>

    );

}

export default Profile;