const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const Category =
    require("./models/Category");

const Product =
    require("./models/Product");

const categoryRoutes =
    require("./routes/categoryRoutes");

const productRoutes =
    require("./routes/productRoutes");


dotenv.config();


const app = express();


app.use(cors());

app.use(express.json());


// ROUTES

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/products",
    productRoutes
);


// HOME

app.get("/", (req, res) => {

    res.send(
        "Q7 Shopping Cart API is Running"
    );

});


// CREATE SAMPLE DATA

async function createSampleData() {

    try {

        const categoryCount =
            await Category.countDocuments();

        const productCount =
            await Product.countDocuments();


        if (
            categoryCount === 0 &&
            productCount === 0
        ) {

            // LEVEL 1 CATEGORIES

            const electronics =
                await Category.create({
                    name: "Electronics",
                    parent: null
                });


            const fashion =
                await Category.create({
                    name: "Fashion",
                    parent: null
                });


            // LEVEL 2 CATEGORIES

            const mobiles =
                await Category.create({
                    name: "Mobiles",
                    parent:
                        electronics._id
                });


            const laptops =
                await Category.create({
                    name: "Laptops",
                    parent:
                        electronics._id
                });


            const men =
                await Category.create({
                    name: "Men",
                    parent:
                        fashion._id
                });


            const women =
                await Category.create({
                    name: "Women",
                    parent:
                        fashion._id
                });


            // PRODUCTS

            await Product.create({

                name: "iPhone 15",

                description:
                    "Apple iPhone 15 with 128GB storage",

                price: 70000,

                quantity: 10,

                category:
                    mobiles._id

            });


            await Product.create({

                name: "Samsung Galaxy S24",

                description:
                    "Samsung Galaxy S24 smartphone",

                price: 65000,

                quantity: 15,

                category:
                    mobiles._id

            });


            await Product.create({

                name: "Dell Laptop",

                description:
                    "Dell laptop with 16GB RAM",

                price: 65000,

                quantity: 8,

                category:
                    laptops._id

            });


            await Product.create({

                name: "HP Laptop",

                description:
                    "HP laptop with 8GB RAM",

                price: 55000,

                quantity: 12,

                category:
                    laptops._id

            });


            await Product.create({

                name: "Men T-Shirt",

                description:
                    "Cotton T-shirt for men",

                price: 799,

                quantity: 25,

                category:
                    men._id

            });


            await Product.create({

                name: "Women Dress",

                description:
                    "Casual dress for women",

                price: 1499,

                quantity: 20,

                category:
                    women._id

            });


            console.log(
                "--------------------------------"
            );

            console.log(
                "Sample categories created"
            );

            console.log(
                "Sample products created"
            );

            console.log(
                "--------------------------------"
            );

        }

    }
    catch (error) {

        console.log(
            "Sample data error:",
            error.message
        );

    }

}


// CONNECT DATABASE

mongoose
    .connect(process.env.MONGO_URI)

    .then(async () => {

        console.log(
            "MongoDB Connected"
        );

        await createSampleData();

    })

    .catch((error) => {

        console.log(
            "MongoDB Error:"
        );

        console.log(
            error.message
        );

    });


// START SERVER

app.listen(
    process.env.PORT,
    () => {

        console.log(
            `Backend running at http://localhost:${process.env.PORT}`
        );

    }
);