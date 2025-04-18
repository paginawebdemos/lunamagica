const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static(path.join(__dirname, "../public/img")));
app.use(express.static(path.join(__dirname, "../public")));

// Base de datos SQLite
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    price TEXT,
    img TEXT,
    description TEXT
  )`);
});

// Configuración de Multer para imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/img"));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage });

// API: Obtener menú
app.get("/api/menu", (req, res) => {
  db.all("SELECT * FROM menu", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Agregar plato
app.post("/api/menu", upload.single("image"), (req, res) => {
  const { name, category, price, description } = req.body;
  const imgPath = `/img/${req.file.filename}`;
  db.run(
    `INSERT INTO menu (name, category, price, img, description) VALUES (?, ?, ?, ?, ?)`,
    [name, category, price, imgPath, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// API: Eliminar plato
app.delete("/api/menu/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM menu WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// API: Login básico (usuario hardcodeado)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // Aquí puedes cambiar las credenciales
  if (email === "admin@lunamagica.com" && password === "123456") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
