import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Leave() {

    const [date, setDate] = useState("");

    const [reason, setReason] =
        useState("");

    const [grant, setGrant] =
        useState("No");

    const [leaves, setLeaves] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem("token");


    // =================================
    // LOAD LEAVES
    // =================================

    const loadLeaves = async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/leaves",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message
                );

            }


            setLeaves(data);


        } catch (error) {

            setError(error.message);

        }

    };


    useEffect(() => {

        loadLeaves();

    }, []);


    // =================================
    // ADD LEAVE
    // =================================

    const addLeave = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/leaves",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            date: date,

                            reason: reason,

                            grant: grant

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message
                );

            }


            setMessage(
                "Leave application added successfully"
            );


            setDate("");

            setReason("");

            setGrant("No");


            loadLeaves();


        } catch (error) {

            setError(error.message);

        }

    };


    return (

        <div className="container">

            <div className="card">

                <h1>Application for Leave</h1>


                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}


                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}


                <h2>Add Leave</h2>


                <form onSubmit={addLeave}>

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        required
                    />


                    <label>
                        Reason
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) =>
                            setReason(e.target.value)
                        }
                        placeholder="Enter reason"
                        required
                    />


                    <label>
                        Grant
                    </label>

                    <select
                        value={grant}
                        onChange={(e) =>
                            setGrant(e.target.value)
                        }
                    >

                        <option value="Yes">
                            Yes
                        </option>

                        <option value="No">
                            No
                        </option>

                    </select>


                    <button type="submit">
                        Add Leave
                    </button>

                </form>


                <hr />


                <h2>Leave List</h2>


                {leaves.length === 0 ? (

                    <p>
                        No leave applications found.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Date</th>

                                <th>Reason</th>

                                <th>Grant</th>

                            </tr>

                        </thead>


                        <tbody>

                            {leaves.map((leave) => (

                                <tr key={leave._id}>

                                    <td>
                                        {new Date(
                                            leave.date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        {leave.reason}
                                    </td>

                                    <td>
                                        {leave.grant}
                                    </td>

                                </tr>

                            ))}

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

export default Leave;