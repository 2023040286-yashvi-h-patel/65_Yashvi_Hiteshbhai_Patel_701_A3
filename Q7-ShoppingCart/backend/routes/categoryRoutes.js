const express = require("express");

const Category = require("../models/Category");

const router = express.Router();


// GET ALL CATEGORIES
router.get("/", async (req, res) => {

    try {

        const categories =
            await Category
                .find()
                .populate("parent", "name")
                .sort({ name: 1 });

        res.json(categories);

    }
    catch (error) {

        res.status(500).json({
            message: "Error loading categories"
        });

    }

});


// GET SINGLE CATEGORY
router.get("/:id", async (req, res) => {

    try {

        const category =
            await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            });

        }

        res.json(category);

    }
    catch (error) {

        res.status(500).json({
            message: "Error loading category"
        });

    }

});


// ADD CATEGORY
router.post("/", async (req, res) => {

    try {

        const {
            name,
            parent
        } = req.body;

        if (!name) {

            return res.status(400).json({
                message: "Category name is required"
            });

        }

        const category =
            new Category({
                name: name,
                parent: parent || null
            });

        await category.save();

        res.status(201).json(category);

    }
    catch (error) {

        res.status(500).json({
            message: "Error adding category"
        });

    }

});


// UPDATE CATEGORY
router.put("/:id", async (req, res) => {

    try {

        const {
            name,
            parent
        } = req.body;

        const category =
            await Category.findByIdAndUpdate(
                req.params.id,
                {
                    name: name,
                    parent: parent || null
                },
                {
                    new: true
                }
            );

        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            });

        }

        res.json(category);

    }
    catch (error) {

        res.status(500).json({
            message: "Error updating category"
        });

    }

});


// DELETE CATEGORY
router.delete("/:id", async (req, res) => {

    try {

        const childCategory =
            await Category.findOne({
                parent: req.params.id
            });

        if (childCategory) {

            return res.status(400).json({
                message:
                    "Cannot delete category because it has subcategories"
            });

        }

        const category =
            await Category.findByIdAndDelete(
                req.params.id
            );

        if (!category) {

            return res.status(404).json({
                message: "Category not found"
            });

        }

        res.json({
            message: "Category deleted successfully"
        });

    }
    catch (error) {

        res.status(500).json({
            message: "Error deleting category"
        });

    }

});


module.exports = router;