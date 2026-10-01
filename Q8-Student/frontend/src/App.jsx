import { useEffect, useState } from "react";

const API_URL = "http://localhost:5003/api/students";

function App() {

    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        course: "",
        age: "",
        city: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");


    const loadStudents = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            setStudents(data);
        }
        catch (error) {
            console.log(error);
            setMessage("Unable to connect to backend");
        }
    };


    useEffect(() => {
        loadStudents();
    }, []);


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !form.name ||
            !form.email ||
            !form.course ||
            !form.age ||
            !form.city
        ) {
            setMessage("Please fill all fields");
            return;
        }

        try {

            if (editingId === null) {

                const response = await fetch(API_URL, {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(form)
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }

                setMessage("Student added successfully");

            }
            else {

                const response = await fetch(
                    `${API_URL}/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(form)
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }

                setMessage("Student updated successfully");
            }

            clearForm();
            loadStudents();

        }
        catch (error) {
            console.log(error);
            setMessage("Server error");
        }
    };


    const editStudent = (student) => {

        setForm({
            name: student.name,
            email: student.email,
            course: student.course,
            age: student.age,
            city: student.city
        });

        setEditingId(student.id);
        setMessage("");
    };


    const deleteStudent = async (id) => {

        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setMessage("Student deleted successfully");

            loadStudents();

        }
        catch (error) {
            console.log(error);
            setMessage("Server error");
        }
    };


    const clearForm = () => {

        setForm({
            name: "",
            email: "",
            course: "",
            age: "",
            city: ""
        });

        setEditingId(null);
    };


    return (
        <div className="container">

            <h1>Student CRUD Application</h1>

            <p className="subtitle">
                Express + Sequelize + React
            </p>


            <div className="form-card">

                <h2>
                    {editingId === null
                        ? "Add Student"
                        : "Edit Student"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Student Name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="course"
                        placeholder="Course"
                        value={form.course}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                    />

                    <div className="button-row">

                        <button
                            type="submit"
                            className="add-button"
                        >
                            {editingId === null
                                ? "Add Student"
                                : "Update Student"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={clearForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>


            {message && (
                <div className="message">
                    {message}
                </div>
            )}


            <div className="table-card">

                <h2>Student List</h2>

                {students.length === 0 ? (

                    <p className="empty">
                        No students found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Age</th>
                                    <th>City</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {students.map((student) => (

                                    <tr key={student.id}>

                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.course}</td>
                                        <td>{student.age}</td>
                                        <td>{student.city}</td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editStudent(student)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteStudent(student.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default App;