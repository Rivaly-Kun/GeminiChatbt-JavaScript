import express from "express";
import pg from "pg";
import cors from "cors";

const { Pool } = pg;
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection setup
const pool = new Pool({
    user: "pharmacy_user",
    host: "localhost",
    database: "pharmacy_db",
    password: "your_password",
    port: 5432,
});

// Endpoint to add a record
app.post("/add-medicine", async (req, res) => {
    const { name, strength, brand, form, price } = req.body;
    const query = `
        INSERT INTO medicine (active_ingredient_name, active_ingredient_strength, brand_name, dosage_form, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    try {
        const result = await pool.query(query, [name, strength, brand, form, price]);
        res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding medicine." });
    }
});

// Endpoint to delete a record
app.delete("/delete-medicine/:id", async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM medicine WHERE id = $1 RETURNING id;`;
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: `Medicine with ID ${id} deleted.` });
        } else {
            res.status(404).json({ error: "Medicine not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting medicine." });
    }
});

// Endpoint to update a record
app.put("/update-medicine", async (req, res) => {
    const { id, field, value } = req.body;
    const query = `UPDATE medicine SET ${field} = $1 WHERE id = $2 RETURNING id;`;
    try {
        const result = await pool.query(query, [value, id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: `Medicine with ID ${id} updated.` });
        } else {
            res.status(404).json({ error: "Medicine not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating medicine." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
