import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error getting products controller: ", error);
        res.status(500).json({ success: false, message: "Error getting products" });
    }
};

export const createProduct = async (req, res) => {
    const { name, image, price } = req.body;

    if (!name || !image || !price) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const product = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${name}, ${image}, ${price})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error creating product controller: ", error);
        res.status(500).json({ success: false, message: "Error creating product" });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;
        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error getting product controller: ", error);
        res.status(500).json({ success: false, message: "Error getting product" });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, image, price } = req.body;

    if (!name || !image || !price) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const product = await sql`
            UPDATE products
            SET name = ${name}, image = ${image}, price = ${price}
            WHERE id = ${id}
            RETURNING *
        `;

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error updating product controller: ", error);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product[0], message: "Product deleted" });
    } catch (error) {
        console.log("Error deleting product controller: ", error);
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
};
