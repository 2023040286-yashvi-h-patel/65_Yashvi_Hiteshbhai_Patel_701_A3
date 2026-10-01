import { useEffect, useState } from "react";


function Products() {

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [quantity, setQuantity] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [message, setMessage] =
        useState("");


    const loadData = async () => {

        const productResponse =
            await fetch(
                "http://localhost:5002/api/products"
            );

        const productData =
            await productResponse.json();

        setProducts(productData);


        const categoryResponse =
            await fetch(
                "http://localhost:5002/api/categories"
            );

        const categoryData =
            await categoryResponse.json();

        setCategories(categoryData);

    };


    useEffect(() => {

        loadData();

    }, []);


    const subcategories =
        categories.filter(
            item => item.parent
        );


    const saveProduct = async (e) => {

        e.preventDefault();

        setMessage("");


        if (
            !name ||
            !description ||
            !price ||
            !quantity ||
            !category
        ) {

            setMessage(
                "Please fill all fields"
            );

            return;

        }


        const url =
            editingId
                ? `http://localhost:5002/api/products/${editingId}`
                : "http://localhost:5002/api/products";


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

                        description:
                            description,

                        price: price,

                        quantity: quantity,

                        category:
                            category

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
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setEditingId(null);


        setMessage(
            editingId
                ? "Product updated"
                : "Product added"
        );


        loadData();

    };


    const editProduct = (product) => {

        setEditingId(
            product._id
        );

        setName(
            product.name
        );

        setDescription(
            product.description
        );

        setPrice(
            product.price
        );

        setQuantity(
            product.quantity
        );

        setCategory(
            product.category._id
        );

    };


    const deleteProduct = async (id) => {

        const response =
            await fetch(
                `http://localhost:5002/api/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        setMessage(data.message);

        loadData();

    };


    return (

        <div className="container">

            <h1>
                Product Management
            </h1>


            <form
                onSubmit={saveProduct}
                className="form-box"
            >

                <h2>
                    {editingId
                        ? "Edit Product"
                        : "Add Product"}
                </h2>


                <label>
                    Product Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Product name"
                />


                <label>
                    Description
                </label>

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                    placeholder="Product description"
                />


                <label>
                    Price
                </label>

                <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                />


                <label>
                    Quantity
                </label>

                <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(e.target.value)
                    }
                />


                <label>
                    Subcategory
                </label>

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select Subcategory
                    </option>


                    {subcategories.map(item => (

                        <option
                            key={item._id}
                            value={item._id}
                        >
                            {item.name}
                        </option>

                    ))}

                </select>


                <button type="submit">

                    {editingId
                        ? "Update Product"
                        : "Add Product"}

                </button>


                {editingId && (

                    <button
                        type="button"
                        onClick={() => {

                            setEditingId(null);
                            setName("");
                            setDescription("");
                            setPrice("");
                            setQuantity("");
                            setCategory("");

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
                Product List
            </h2>


            <table>

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>
                            Category
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {products.map(product => (

                        <tr key={product._id}>

                            <td>
                                {product.name}
                            </td>

                            <td>
                                {product.description}
                            </td>

                            <td>
                                ₹{product.price}
                            </td>

                            <td>
                                {product.quantity}
                            </td>

                            <td>
                                {product.category?.name}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        editProduct(product)
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() =>
                                        deleteProduct(
                                            product._id
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

export default Products;