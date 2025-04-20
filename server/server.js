const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔐 Credenciales protegidas
const ADMIN_EMAIL = "admin@luna.com";
const ADMIN_PASSWORD = "1234";

// Conexión PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Crear tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category TEXT,
    price TEXT,
    description TEXT,
    img TEXT
  )
`);

// ✅ Login seguro
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Credenciales incorrectas" });
  }
});

// 📤 Subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/img"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 📦 Obtener platos
app.get("/api/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dishes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Agregar plato
app.post("/api/menu", upload.single("image"), async (req, res) => {
  const { name, category, price, description } = req.body;
  const img = `/img/${req.file.filename}`;
  try {
    const result = await pool.query(
      "INSERT INTO dishes (name, category, price, description, img) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, category, price, description, img]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Eliminar plato
app.delete("/api/menu/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM dishes WHERE id = $1", [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
