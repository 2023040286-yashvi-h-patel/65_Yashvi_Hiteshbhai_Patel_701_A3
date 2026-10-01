import { useEffect, useState } from "react";


function Categories() {

    const [categories, setCategories] =
        useState([]);

    const [name, setName] =
        useState("");

    const [parent, setParent] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");


    const loadCategories = async () => {

        const response =
            await fetch(
                "http://localhost:5002/api/categories"
            );

        const data =
            await response.json();

        setCategories(data);

    };


    useEffect(() => {

        loadCategories();

    }, []);


    const saveCategory = async (e) => {

        e.preventDefault();

        setMessage("");


        if (!name.trim()) {

            setMessage(
                "Please enter category name"
            );

            return;

        }


        const url =
            editingId
                ? `http://localhost:5002/api/categories/${editingId}`
                : "http://localhost:5002/api/categories";


        const method =
            editingId ? "PUT" : "POST";


        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        parent: parent || null
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            setMessage(data.message);

            return;

        }


        setName("");
        setParent("");
        setEditingId(null);

        setMessage(
            editingId
                ? "Category updated"
                : "Category added"
        );


        loadCategories();

    };


    const editCategory = (category) => {

        setEditingId(
            category._id
        );

        setName(
            category.name
        );

        setParent(
            category.parent
                ? category.parent._id
                : ""
        );

    };


    const deleteCategory = async (id) => {

        const response =
            await fetch(
                `http://localhost:5002/api/categories/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        setMessage(data.message);

        loadCategories();

    };


    const levelOne =
        categories.filter(
            category =>
                !category.parent
        );


    return (

        <div className="container">

            <h1>
                Category Management
            </h1>


            <form
                onSubmit={saveCategory}
                className="form-box"
            >

                <h2>
                    {editingId
                        ? "Edit Category"
                        : "Add Category"}
                </h2>


                <label>
                    Category Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Example: Mobiles"
                />


                <label>
                    Parent Category
                </label>

                <select
                    value={parent}
                    onChange={(e) =>
                        setParent(e.target.value)
                    }
                >

                    <option value="">
                        None - Level 1
                    </option>


                    {levelOne.map(category => (

                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>

                    ))}

                </select>


                <button type="submit">

                    {editingId
                        ? "Update Category"
                        : "Add Category"}

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={() => {

                            setEditingId(null);
                            setName("");
                            setParent("");

                        }}
                    >
                        Cancel
                    </button>

                )}

            </form>


            {message && (

                <p className="message">
                    {message}
                </p>

            )}


            <h2>
                Category List
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Name
                        </th>

                        <th>
                            Level
                        </th>

                        <th>
                            Parent
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {categories.map(category => (

                        <tr key={category._id}>

                            <td>
                                {category.name}
                            </td>

                            <td>

                                {category.parent
                                    ? "Level 2"
                                    : "Level 1"}

                            </td>

                            <td>

                                {category.parent
                                    ? category.parent.name
                                    : "-"}

                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        editCategory(category)
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        deleteCategory(
                                            category._id
                                        )
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

    );

}

export default Categories;