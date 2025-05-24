const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Pool } = require("pg");


const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "host.docker.internal", // Famma chi "db" bch yconnecti lel container postgres
  database: "gestion",
  password: "nebli",
  port: 5432,
});


// Login
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM utilisateurs WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }

        const user = result.rows[0];
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET || "secret");

        res.json({ message: "Connexion réussie !", token, role: user.role, id: user.id });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Liste des classes
app.get("/api/classes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM classes");
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des classes :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Liste des matières
app.get("/api/matieres", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM matieres");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Demande d'inscription
app.post("/api/register-request", async (req, res) => {
    const { id, username, password, role, classe, enseignant_classes, enseignant_matieres } = req.body;

    try {
        await pool.query(
            "INSERT INTO demandes (id, username, password, role, status, classe, enseignant_classes, enseignant_matieres) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [id, username, password, role, 'pending', classe || null, JSON.stringify(enseignant_classes) || null, JSON.stringify(enseignant_matieres) || null]
        );
        res.status(201).json({ message: "Demande d'inscription envoyée." });
    } catch (error) {
        console.error("Erreur d'inscription :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Récupération des demandes
app.get("/api/register-requests", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM demandes WHERE status = 'pending'");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des demandes." });
    }
});

// Approuver une demande
app.post("/api/approve-request", async (req, res) => {
    const { id } = req.body;

    try {
        const request = await pool.query("SELECT * FROM demandes WHERE id = $1", [id]);
        if (request.rows.length === 0) return res.status(404).json({ message: "Demande non trouvée." });

        const { username, password, role, classe, enseignant_classes, enseignant_matieres } = request.rows[0];

        await pool.query(
            "INSERT INTO utilisateurs (id, username, password, role, classe) VALUES ($1, $2, $3, $4, $5)",
            [id, username, password, role, classe]
        );

        if (role === 'enseignant' && enseignant_classes) {
            const classes = JSON.parse(enseignant_classes);
            for (const cl of classes) {
                await pool.query(
                    "INSERT INTO enseignant_classes (enseignant_id, classe) VALUES ($1, $2)",
                    [id, cl]
                );
            }
        }

        if (role === 'enseignant' && enseignant_matieres) {
            let matieres;
            try {
                matieres = typeof enseignant_matieres === 'string' ? JSON.parse(enseignant_matieres) : enseignant_matieres;
            } catch (e) {
                console.error("Erreur parsing enseignant_matieres:", enseignant_matieres);
                return res.status(400).json({ message: "enseignant_matieres invalide." });
            }

            for (const matiereId of matieres) {
                await pool.query(
                    "INSERT INTO enseignant_matieres (enseignant_id, matiere_id) VALUES ($1, $2)",
                    [id, matiereId]
                );
            }
        }


        await pool.query("UPDATE demandes SET status = 'approved' WHERE id = $1", [id]);
        res.json({ message: "Demande approuvée avec succès." });

    } catch (error) {
        console.error("Erreur d'approbation :", error); // 👈 très important pour voir la vraie erreur
        res.status(500).json({ message: "Erreur d'approbation." });
    }

});

// Rejeter une demande
app.post("/api/reject-request", async (req, res) => {
    const { id } = req.body;

    try {
        await pool.query("DELETE FROM demandes WHERE id = $1", [id]);
        res.json({ message: "Demande rejetée." });
    } catch (error) {
        res.status(500).json({ message: "Erreur de rejet." });
    }
});

// Ajouter un cours
app.post("/api/cours", async (req, res) => {
    const { enseignant_id, classe, titre, contenu } = req.body;

    try {
        await pool.query(
            "INSERT INTO cours (enseignant_id, classe, titre, contenu) VALUES ($1, $2, $3, $4)",
            [enseignant_id, classe, titre, contenu]
        );
        res.status(201).json({ message: "Cours ajouté avec succès." });
    } catch (error) {
        console.error("Erreur d'ajout du cours :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Récupérer les cours par classe
app.get("/api/cours/:classe", async (req, res) => {
    const { classe } = req.params;

    try {
        const result = await pool.query("SELECT * FROM cours WHERE classe = $1 ORDER BY date_creation DESC", [classe]);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération cours:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Récupérer les classes enseignées par un enseignant
app.get("/api/enseignant-classes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT classe FROM enseignant_classes WHERE enseignant_id = $1", [id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur get enseignant_classes:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Récupérer les matières enseignées par un enseignant
app.get("/api/enseignant-matieres/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT m.id, m.nom FROM enseignant_matieres em JOIN matieres m ON em.matiere_id = m.id WHERE em.enseignant_id = $1", [id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération matières:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Récupérer la classe d'un utilisateur
app.get("/api/user-classe/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT classe FROM utilisateurs WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ classe: result.rows[0].classe });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Récupérer les étudiants d'une classe
app.get("/api/etudiants/:classe", async (req, res) => {
    const { classe } = req.params;
    try {
        const result = await pool.query("SELECT id, username FROM utilisateurs WHERE role = 'etudiant' AND classe = $1", [classe]);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération étudiants:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// Enregistrement des notes avec matière
app.post("/api/notes", async (req, res) => {
    const { classe, enseignant_id, matiere_id, notes } = req.body;
    try {
        for (const n of notes) {
            await pool.query(
                "INSERT INTO notes (etudiant_id, enseignant_id, classe, matiere_id, note) VALUES ($1, $2, $3, $4, $5)",
                [n.etudiant_id, enseignant_id, classe, matiere_id, n.note]
            );
        }
        res.json({ message: "Notes enregistrées." });
    } catch (error) {
        console.error("Erreur enregistrement des notes:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

app.get("/api/note/:etudiantId", async (req, res) => {
    const { etudiantId } = req.params;
    const query = "SELECT note FROM notes WHERE etudiant_id = $1";

    try {
        const result = await pool.query(query, [etudiantId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).send("Erreur serveur");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});