const express = require("express");

const Product = require("../models/Product");

const router = express.Router();


// GET ALL PRODUCTS
router.get("/", async (req, res) => {

    try {

        const products =
            await Product
                .find()
                .populate("category", "name parent")
                .sort({ createdAt: -1 });

        res.json(products);

    }
    catch (error) {

        res.status(500).json({
            message: "Error loading products"
        });

    }

});


// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {

    try {

        const product =
            await Product
                .findById(req.params.id)
                .populate("category", "name parent");

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(product);

    }
    catch (error) {

        res.status(500).json({
            message: "Error loading product"
        });

    }

});


// ADD PRODUCT
router.post("/", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            quantity,
            category
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            quantity === undefined ||
            !category
        ) {

            return res.status(400).json({
                message: "All product fields are required"
            });

        }

        const product =
            new Product({
                name: name,
                description: description,
                price: Number(price),
                quantity: Number(quantity),
                category: category
            });

        await product.save();

        const savedProduct =
            await Product
                .findById(product._id)
                .populate("category", "name parent");

        res.status(201).json(savedProduct);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error adding product"
        });

    }

});


// UPDATE PRODUCT
router.put("/:id", async (req, res) => {

    try {

        const {
            name,
            description,
            price,
            quantity,
            category
        } = req.body;

        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name: name,
                    description: description,
                    price: Number(price),
                    quantity: Number(quantity),
                    category: category
                },
                {
                    new: true
                }
            ).populate(
                "category",
                "name parent"
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(product);

    }
    catch (error) {

        res.status(500).json({
            message: "Error updating product"
        });

    }

});


// DELETE PRODUCT
router.delete("/:id", async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product deleted successfully"
        });

    }
    catch (error) {

        res.status(500).json({
            message: "Error deleting product"
        });

    }

});


module.exports = router;